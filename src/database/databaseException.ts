import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {DatabaseError} from "../common/errors/InfrastructureError";
import {GlobalLogger} from "../logging/GlobalLogger";

export type LogLevel = "warn" | "info" | "error";

interface IError {
    code: string;
    message?: string;
    level?: LogLevel;
}

export class RepositoryDataNotFoundError extends Error {}

export class RepositoryError extends DatabaseError {
    code: string;
    module: string;
    operation: string;
    exception: Error;
    level: LogLevel;

    constructor(exception: Error, module: string, operation?: string) {
        const {code, message, level} = handleException(exception);

        const operationStr = operation ?? "";
        GlobalLogger.error(module, operationStr, exception);
        const customerMsg = process.env.NODE_ENV !== "local" ? `${code}` : message || exception.message;
        super(customerMsg);
        this.code = code;
        this.module = module;
        this.exception = exception;
        this.operation = operationStr;
        this.stack = exception.stack;
        this.level = level || "error";
    }
}

export const CommonRepositoryExceptions: Record<string, IError> = {
    // DB
    DB_CONNECTION: {
        code: "DB_CONNECTION",
        message: "Error ocurred while connecting to DB",
    },
    DB_CLIENT_ERROR_NEEDS_RESTART: {
        code: "DB_CLIENT_ERROR_NEEDS_RESTART",
        message: "Error in DB Client, app should be restarted",
    },
    DB_CLIENT_UNKNOWN_ERROR: {code: "DB_CLIENT_UNKNOWN_ERROR", message: "Unknown DB error"},
    DB_CLIENT_INVALID_QUERY: {code: "DB_CLIENT_INVALID_QUERY", message: "Invalid DB query"},
    DB_CLIENT_INVALID_SCHEMA: {code: "DB_CLIENT_INVALID_SCHEMA", message: "Invalid DB Schema"},
    DB_INVALID_QUERY: {code: "DB_INVALID_QUERY", message: "Invalid Query"},

    DB_INVALID_DATA: {code: "DB_INVALID_DATA", message: "Invalid Data"},
    DB_GENERIC_ERROR: {code: "DB_GENERIC_ERROR"},
    DB_UNIQUE_KEY_ERROR: {
        code: "DB_UNIQUE_KEY_ERROR",
        message: "Duplicated value for unique key",
        level: "info",
    },
    DB_FOREIGN_KEY_ERROR: {
        code: "DB_FOREIGN_KEY_ERROR",
        message: "Foreign key constraint failed",
        level: "info",
    },
    DB_UNHANDLED_ERROR: {
        code: "DB_UNHANDLED_ERROR",
        message: "Unhandled DB error",
        level: "error",
    },
};

/**
 * Converts exception to a generic exception independent from the DB engine/client used
 * @param exception exception
 * @returns generic exception independent from the DB engine/client used
 */
const handleException = (exception: Error): IError => {
    let code: string;
    let message: string;
    const level: LogLevel = CommonRepositoryExceptions.DB_UNHANDLED_ERROR.level || "error";

    message = exception.message;
    if (exception instanceof PrismaClientKnownRequestError) {
        const {code: bdCode} = convertPrismaCodeToDBMessageCode(exception.code);
        code = bdCode;
    } else if (exception instanceof PrismaClientUnknownRequestError) {
        code = CommonRepositoryExceptions.DB_CLIENT_UNKNOWN_ERROR.code;
        message = CommonRepositoryExceptions.DB_CLIENT_UNKNOWN_ERROR.message || exception.message;
    } else if (exception instanceof PrismaClientRustPanicError) {
        code = CommonRepositoryExceptions.DB_CLIENT_ERROR_NEEDS_RESTART.code;
        message = CommonRepositoryExceptions.DB_CLIENT_UNKNOWN_ERROR.message || exception.message;
    } else if (exception instanceof PrismaClientInitializationError) {
        code = CommonRepositoryExceptions.DB_CONNECTION.code;
        message = CommonRepositoryExceptions.DB_CLIENT_UNKNOWN_ERROR.message || exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
        code = CommonRepositoryExceptions.DB_CLIENT_INVALID_QUERY.code;
        message = CommonRepositoryExceptions.DB_CLIENT_UNKNOWN_ERROR.message || exception.message;
    } else {
        code = CommonRepositoryExceptions.DB_UNHANDLED_ERROR.code;
        message = CommonRepositoryExceptions.DB_UNHANDLED_ERROR.message || exception.message;
    }

    return {
        code: code,
        message: message,
        level: level,
    };
};

const errorCodeMap: Record<string, IError> = {
    P1000: CommonRepositoryExceptions.DB_CONNECTION, // Invalid Credentials
    P1001: CommonRepositoryExceptions.DB_CONNECTION, // DB Server Unreachable
    P1002: CommonRepositoryExceptions.DB_CONNECTION, // DB Connection Timed Out
    P1003: CommonRepositoryExceptions.DB_CONNECTION, // DB not exists
    P1008: CommonRepositoryExceptions.DB_CONNECTION, // Operation Timed Out
    P1010: CommonRepositoryExceptions.DB_CONNECTION, // User not authorized
    P1011: CommonRepositoryExceptions.DB_CONNECTION, // TLS connection error
    P1013: CommonRepositoryExceptions.DB_CONNECTION, // Invalid DB URL
    P1017: CommonRepositoryExceptions.DB_CONNECTION, // Server closed connection
    P2024: CommonRepositoryExceptions.DB_CONNECTION, // Time out getting connection from pool
    P1012: CommonRepositoryExceptions.DB_CLIENT_INVALID_SCHEMA, // Invalid Schema
    P1014: CommonRepositoryExceptions.DB_CLIENT_INVALID_SCHEMA, // Invalid Type for Model in Schema
    P1015: CommonRepositoryExceptions.DB_CLIENT_INVALID_SCHEMA, // Unsupported features used in schema
    P1016: CommonRepositoryExceptions.DB_INVALID_QUERY, // Incorrect amount of parameters
    P2008: CommonRepositoryExceptions.DB_INVALID_QUERY, // Failed to parse query
    P2009: CommonRepositoryExceptions.DB_INVALID_QUERY, // Failed to validate query
    P2010: CommonRepositoryExceptions.DB_INVALID_QUERY, // Raw query failed
    P2016: CommonRepositoryExceptions.DB_INVALID_QUERY, // Query interpretation error
    P2021: CommonRepositoryExceptions.DB_INVALID_QUERY, // Table does not exist in DB
    P2022: CommonRepositoryExceptions.DB_INVALID_QUERY, // Column does not exist in DB
    P2026: CommonRepositoryExceptions.DB_INVALID_QUERY, // DB provider does not support a feature used in query
    P2000: CommonRepositoryExceptions.DB_INVALID_DATA, // Data too long for column
    P2001: CommonRepositoryExceptions.DB_INVALID_DATA, // Record in where clause not exists
    P2004: CommonRepositoryExceptions.DB_INVALID_DATA, // Constraint Failed
    P2005: CommonRepositoryExceptions.DB_INVALID_DATA, // Invalid value for field stored
    P2006: CommonRepositoryExceptions.DB_INVALID_DATA, // Invalid value for field provided
    P2007: CommonRepositoryExceptions.DB_INVALID_DATA, // Data validation error
    P2011: CommonRepositoryExceptions.DB_INVALID_DATA, // Null constraint failed
    P2012: CommonRepositoryExceptions.DB_INVALID_DATA, // Missing required value
    P2013: CommonRepositoryExceptions.DB_INVALID_DATA, // Missing required argument
    P2014: CommonRepositoryExceptions.DB_INVALID_DATA, // Change will violate a constraint
    P2015: CommonRepositoryExceptions.DB_INVALID_DATA, // Related record could not be found
    P2017: CommonRepositoryExceptions.DB_INVALID_DATA, // Record in relation not connected
    P2018: CommonRepositoryExceptions.DB_INVALID_DATA, // Record in relation not found
    P2019: CommonRepositoryExceptions.DB_INVALID_DATA, // Input error
    P2020: CommonRepositoryExceptions.DB_INVALID_DATA, // Value out of range
    P2023: CommonRepositoryExceptions.DB_INVALID_DATA, // Inconsistent column data
    P2025: CommonRepositoryExceptions.DB_INVALID_DATA, // Operation failed due to record required not found
    P2002: CommonRepositoryExceptions.DB_UNIQUE_KEY_ERROR, // Unique Constraint Failed
    P2003: CommonRepositoryExceptions.DB_FOREIGN_KEY_ERROR, // Foreign Constraint Failed
    P2027: CommonRepositoryExceptions.DB_GENERIC_ERROR, // Multiple errors detected
};
/**
 * Transforms Prisma codes to generic ones independent of the DB client/engine used
 *
 * Reference: https://www.prisma.io/docs/reference/api-reference/error-reference/#error-codes
 *
 * Note: Migration and introspection errors not added as they should not occur in PRO/DEV envs
 *
 * @param code DB Prisma exception code
 * @returns generic exception code independent of the DB client/engine used
 */
const convertPrismaCodeToDBMessageCode = (code: string): IError => {
    const genericCode: IError = {code};
    return errorCodeMap[code] || genericCode;
};
