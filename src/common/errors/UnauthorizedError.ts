import {Logger} from "../../logging/Logger";
import {BaseError} from "./BaseError";
import {ErrorCode} from "./ErrorCode";

export class UnauthorizedError extends BaseError {
    constructor(message?: string, logger?: Logger, originalMethod?: string) {
        super(ErrorCode.UNAUTHORIZED, message, logger, originalMethod);
    }
}
