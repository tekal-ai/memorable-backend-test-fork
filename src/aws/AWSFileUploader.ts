import AWS from "aws-sdk";
import axios from "axios";
import {Service} from "typedi";
import {BadRequestError} from "../common/errors/BadRequestError";
import {Result} from "../common/Result";
import {FileValidator} from "../common/utils/FileValidator";
import {Config} from "../config/Config";
import {MOCK_S3_FILE} from "../config/Config.local";
import {SentryCaptureException} from "../sentry/sentryExceptions";

export type PreSignedUrl = {
    url: string;
    preSignedUrl: string;
};

@Service()
export class AWSFileUploader {
    private s3: AWS.S3;

    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.update({
            region: Config.aws.region,
            accessKeyId: Config.aws.accessKeyId,
            secretAccessKey: Config.aws.secretAccessKey,
        });
        this.s3 = new AWS.S3();
    }

    async uploadFromPreSignedUrl(base64: string, url: string, mimeType: string) {
        const fileContent = Buffer.from(base64, "base64");

        try {
            const result = await axios({
                method: "PUT",
                url,
                headers: {
                    "Content-Type": mimeType,
                },
                data: fileContent,
            });

            return Result.Success(result.data);
        } catch (error) {
            SentryCaptureException(error);
            if (error instanceof Error) {
                return Result.Exception(error);
            }
            throw error;
        }
    }

    async getUploadPreSignedUrl(filename: string, mimeType: string, bucket?: string): Promise<Result<PreSignedUrl>> {
        if (Config.local) {
            filename = MOCK_S3_FILE;
        }

        const fileNameWithExtension = this.addFileExtension(filename, mimeType);
        const validationResult = new FileValidator().validateFile(fileNameWithExtension, mimeType);

        if (!validationResult.isValid) {
            throw new BadRequestError(validationResult.errorMessage);
        }

        try {
            const url = this.s3.getSignedUrl("putObject", {
                Bucket: bucket ?? Config.s3.bucket,
                Key: fileNameWithExtension,
                ContentType: mimeType,
                Expires: 60 * 15, // 15 minutes
            });
            return Result.Success({
                url: url.split("?")[0],
                preSignedUrl: url,
            });
        } catch (error) {
            SentryCaptureException(error);
            if (error instanceof Error) {
                return Result.Exception(error);
            }
            throw error;
        }
    }

    async moveFileToAnotherBucket(filename: string, mimeType: string, originalSourceOfFile: string) {
        if (Config.local) {
            filename = MOCK_S3_FILE;
        }
        const newParams = {
            Bucket: `${Config.s3.bucket}`,
            CopySource: originalSourceOfFile,
            Key: this.addFileExtension(filename, mimeType),
        };

        return this.s3.copyObject(newParams, (err, data) => {
            if (err) {
                return Result.Exception(err);
            }
            return Result.Success(data);
        });
    }

    private addFileExtension(filename: string, mimeType: string): string {
        const fileExtension = "." + mimeType.split("/").pop();
        if (!filename.endsWith(fileExtension)) {
            filename += fileExtension;
        }
        return filename;
    }

    generateS3URL(bucket: string, filename: string, mimeType: string): string {
        const key = this.addFileExtension(filename, mimeType);
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }

    getBucketFromS3Url(url: string): {bucket: string; key: string} {
        const regex = "https://(.+).s3.amazonaws.com/(.+)";
        const matches = url.match(regex);

        if (!matches) throw new Error(`Invalid S3 url: '${url}'`);

        return {
            bucket: matches[1],
            key: matches[2],
        };
    }
}
