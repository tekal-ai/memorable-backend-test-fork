import {Service} from "typedi";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {ApiService} from "../../../common/service/ApiService";
import {FileValidator} from "../../../common/utils/FileValidator";
import {Config} from "../../../config/Config";
import {FileType} from "../../common/entities/FileType";
import {Target, UploadLambdaRequest} from "../entities/CreativeLambdaRequest";
import {UploadDataResponse} from "../entities/UploadDataResponse";

@Service()
export class FileHandlerService {
    constructor(private readonly apiService: ApiService) {}

    async getCreativeUploadData(parentPath: string, mimeType: string, extension: string): Promise<UploadDataResponse> {
        return this.getUploadData(parentPath, mimeType, extension);
    }

    async getLogoUploadData(parentPath: string, mimeType: string, extension: string): Promise<UploadDataResponse> {
        return this.getUploadData(parentPath, mimeType, extension, Target.logo);
    }

    private async getUploadData(
        parentPath: string,
        mimeType: string,
        extension: string,
        target = Target.main,
    ): Promise<UploadDataResponse> {
        const fileValidator = new FileValidator();
        if (target === Target.logo && !fileValidator.isImage(mimeType)) {
            throw new BadRequestError(ErrorMsg.LOGO_MUST_BE_IMAGE);
        }
        fileValidator.validateUploadRequest(mimeType, extension);
        const fileType = fileValidator.getFileType(mimeType);
        return this.callCreativeLambda(fileType, mimeType, extension, parentPath, target);
    }

    private async callCreativeLambda(
        fileType: FileType,
        mimeType: string,
        extension: string,
        parentPath: string,
        target = Target.main,
    ) {
        const response = await this.apiService.postWithApiKey<UploadLambdaRequest, UploadDataResponse>(
            Config.lambdas.creativesHandlerUrl,
            {
                fileType,
                mimeType,
                extension,
                parentPath,
                target,
            },
            {headers: {"x-api-key": Config.lambdasKeys.creativesHandlerApiKey}},
        );
        if (!response.isSuccessful()) {
            throw new Error(`An error has occurred when calling the creatives lambda: ${response.getError()}`);
        }
        const data = response.getData();
        data.presignedData.fields = JSON.stringify(data.presignedData.fields);
        return data;
    }
}
