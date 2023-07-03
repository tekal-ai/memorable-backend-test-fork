import {Logger} from "../../logging/Logger";
import {BaseError} from "./BaseError";
import {ErrorCode} from "./ErrorCode";

export class NotFoundError extends BaseError {
    constructor(message?: string, logger?: Logger, originalMethod?: string) {
        super(ErrorCode.NOT_FOUND, message, logger, originalMethod);
    }
}
