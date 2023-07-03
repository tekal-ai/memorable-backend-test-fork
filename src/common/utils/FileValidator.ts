import {FileType} from "../../intelligentSuite/common/entities/FileType";
import {Logger} from "../../logging/Logger";
import {BadRequestError} from "../errors/BadRequestError";
import {ErrorMsg} from "../errors/ErrorCode";

interface FileValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

export class FileValidator {
    private allowedMimeTypes: string[];
    private allowedExtensions: string[];
    private logger: Logger;

    constructor() {
        this.allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
        this.allowedExtensions = [".jpeg", ".jpg", ".png", ".gif", ".mp4", ".mov", ".avi", ".wmv", ".quicktime"];
        this.logger = new Logger(FileValidator);
    }

    private mountResponse(isValid: boolean) {
        if (!isValid) {
            return {
                isValid: false,
                errorMessage: "Invalid file type. Please upload an image or video file.",
            };
        }

        return {
            isValid: true,
        };
    }

    public getFileType(mimeType: string): FileType {
        if (mimeType.includes("video")) {
            return FileType.VIDEO;
        }

        return FileType.IMAGE;
    }

    public isImage(mimeType: string): boolean {
        return mimeType.includes("image");
    }

    public validateUploadRequest(mimeType: string, extension: string) {
        this.logger.verbose(this.validateUploadRequest.name, "validating file", {
            mimeType,
            extension,
        });

        const isValid =
            this.allowedExtensions.includes(this.getFileExtension(extension)) &&
            this.allowedMimeTypes.includes(mimeType);

        if (!isValid) {
            throw new BadRequestError(ErrorMsg.FILE_FORMAT_NOT_SUPPORTED, this.logger, this.validateUploadRequest.name);
        }

        this.logger.debug(this.validateUploadRequest.name, "file validation completed");
    }
    public validateExtension(extension: string) {
        const isValid = this.allowedExtensions.includes(this.getFileExtension(extension));

        return this.mountResponse(isValid);
    }

    public validateFile(fileName: string, mimeType: string): FileValidationResult {
        const isValidMimeType = this.allowedMimeTypes.includes(mimeType);
        const isValidExtension = this.allowedExtensions.includes(this.getFileExtension(fileName));

        return this.mountResponse(!isValidMimeType || !isValidExtension);
    }

    private getFileExtension(filename: string): string {
        return "." + filename.split(".").pop();
    }
}
