import {Logger} from "../../logging/Logger";
import {BaseError} from "./BaseError";
import {ErrorCode} from "./ErrorCode";

export class BadRequestError extends BaseError {
    constructor(message?: string, logger?: Logger, originalMethod?: string) {
        super(ErrorCode.BAD_REQUEST, message, logger, originalMethod);
    }
}
