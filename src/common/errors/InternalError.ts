import {Logger} from "../../logging/Logger";
import {BaseError} from "./BaseError";
import {ErrorCode} from "./ErrorCode";

export class InternalError extends BaseError {
    constructor(message?: string, logger?: Logger, originalMethod?: string) {
        super(ErrorCode.INTERNAL, message, logger, originalMethod);
    }
}
