import {ApolloError} from "apollo-server";
import {Logger} from "../../logging/Logger";
import {ErrorCode} from "./ErrorCode";

export class BaseError extends ApolloError {
    protected errorCode: ErrorCode;
    constructor(errorCode: ErrorCode, message?: string, logger?: Logger, originalMethod?: string) {
        super(message || errorCode.toString(), errorCode);
        this.errorCode = errorCode || ErrorCode.INTERNAL;
        const errorMessage = message || this.errorCode.toString();
        logger?.error(originalMethod || "Method not provided", errorMessage, this);
    }
}
