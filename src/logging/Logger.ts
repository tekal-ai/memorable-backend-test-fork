/* eslint-disable @typescript-eslint/ban-types */
import * as winston from "winston";
import Sentry from "winston-sentry-log";
import {Config} from "../config/Config";

const sentryOptions = {
    dsn: Config.sentryDSN,
    tracesSampleRate: 0,
    enabled: !Config.local,
    environment: `Dashboard Backend: ${process.env.NODE_ENV || "local"}`,
};
enum LogLevel {
    Error = "error",
    Warn = "warn",
    Info = "info",
    Debug = "debug",
    Verbose = "verbose",
}

const customFormat = winston.format.printf(({level, message, tags, timestamp}) => {
    const tagString = tags && Object.keys(tags).length !== 0 ? `${JSON.stringify(tags, null, 2)}` : "";
    return `[${level}] ${timestamp} -->\n ${message} -->\n ${tagString}`;
});

export class Logger {
    private logger: winston.Logger;

    private readonly writer: string;

    constructor(writer?: string | Function | Object, level?: LogLevel) {
        this.writer = writer ? this.getClassName(writer) : "No writer provided";
        this.logger = winston.createLogger({
            format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), customFormat),
            level: level || process.env.LOG_LEVEL || "info",
            transports: [new winston.transports.Console({level: level}), new Sentry(sentryOptions)],
            handleExceptions: false,
        });
    }

    private log(level: LogLevel, method: string, message: string, data: Record<string, unknown> = {}): void {
        if (this.logger.isLevelEnabled(level)) {
            this.logger.log(level, `[[${this.writer}]]:|${method}| \n ${message}`, data);
        }
    }
    private getClassName(writer: Function | Object): string {
        if (typeof writer === "function") {
            return writer.name;
        } else if (typeof writer === "object") {
            return writer.constructor.name;
        } else if (typeof writer === "string") {
            return writer;
        }
        return "unknown";
    }

    error(method: string, message: string, error: Error): void {
        this.log(LogLevel.Error, method, message, {error});
    }

    warn(method: string, message: string, tags: Record<string, unknown> = {}): void {
        this.log(LogLevel.Warn, method, message, {tags});
    }

    info(method: string, message: string, tags: Record<string, unknown> = {}): void {
        this.log(LogLevel.Info, method, message, {tags});
    }

    verbose(method: string, message: string, tags: Record<string, unknown> = {}): void {
        this.log(LogLevel.Verbose, method, message, {tags});
    }

    debug(method: string, message: string, tags: Record<string, unknown> = {}): void {
        this.log(LogLevel.Debug, method, message, {tags});
    }
}
