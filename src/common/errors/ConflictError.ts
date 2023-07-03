import {Logger} from "../../logging/Logger";
import {BaseError} from "./BaseError";
import {ErrorCode} from "./ErrorCode";

export class ConflictError extends BaseError {
    constructor(message?: string, logger?: Logger, originalMethod?: string) {
        super(ErrorCode.CONFLICT, message, logger, originalMethod);
    }
}
