import {FileType} from "../../common/entities/FileType";

export enum Target {
    main = "main",
    logo = "logo",
    custom = "custom",
}
export class UploadLambdaRequest {
    fileType!: FileType;
    mimeType!: string;
    extension!: string;
    parentPath!: string;
    target = Target.main;
}
