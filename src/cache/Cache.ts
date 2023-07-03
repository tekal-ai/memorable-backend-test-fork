import {plainToInstance} from "class-transformer";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {Md5} from "ts-md5";
import {Inject, Service} from "typedi";
import {promisify} from "util";
import {Logger} from "../logging/Logger";
import {SentryCaptureException} from "../sentry/sentryExceptions";
import {CacheClient, CACHE_CLIENT} from "./cacheConnection";

export type CacheExpiration = {
    hours: number;
    minutes: number;
};

@Service()
export class Cache {
    protected logger: Logger;

    constructor(@Inject(CACHE_CLIENT) private cacheClient: CacheClient) {
        this.logger = new Logger(this.constructor.name);
    }

    async get<T>(prefix: string, key: string, resultClass: ClassConstructor<T>): Promise<T | null> {
        try {
            if (!this.cacheClient) {
                this.logger.warn(prefix, "cache not configured for the service", {
                    cacheKey: key,
                });
                return null;
            }
            this.logger.debug(prefix, "get from cache", {
                cacheKey: key,
            });

            const cacheKey = this.createKey(prefix, key);
            const result = await promisify(this.cacheClient.get).bind(this.cacheClient, cacheKey)();

            if (!result) {
                this.logger.debug(prefix, "cache not found", {
                    cacheKey: key,
                });
                return null;
            }

            return plainToInstance(resultClass, JSON.parse(result), {enableImplicitConversion: true});
        } catch (error) {
            // Ignore error
            SentryCaptureException(error);
            return null;
        }
    }

    async getArray<T>(prefix: string, key: string, resultClass: ClassConstructor<T>): Promise<T[] | null> {
        try {
            if (!this.cacheClient) {
                this.logger.warn(prefix, "cache not configured for the service", {
                    cacheKey: key,
                });
                return null;
            }
            this.logger.debug(prefix, "get from cache", {
                cacheKey: key,
            });

            const cacheKey = this.createKey(prefix, key);
            const result = await promisify(this.cacheClient.get).bind(this.cacheClient, cacheKey)();

            if (!result) {
                this.logger.debug(prefix, "cache not found", {
                    cacheKey: key,
                });
                return null;
            }

            return plainToInstance(resultClass, JSON.parse(result), {enableImplicitConversion: true}) as unknown as
                | T[]
                | null;
        } catch (error) {
            // Ignore error
            SentryCaptureException(error);
            return null;
        }
    }
    async set<T>(prefix: string, key: string, value: T, expirationTime?: CacheExpiration): Promise<void> {
        try {
            this.logger.verbose(prefix, "storing on cache", {
                cacheKey: key,
            });
            if (!this.cacheClient || value === null || value === undefined) return;

            const cacheKey = this.createKey(prefix, key);
            const cacheValue = JSON.stringify(value);

            if (expirationTime) {
                await promisify(this.cacheClient.set).bind(
                    this.cacheClient,
                    cacheKey,
                    cacheValue,
                    "EX",
                    this.getExpirationTime(expirationTime),
                )();
            } else {
                await promisify(this.cacheClient.set).bind(this.cacheClient, cacheKey, cacheValue)();
            }
        } catch (error) {
            // Ignore error
            SentryCaptureException(error);
        }
    }

    async deleteKey(prefix: string, key: string) {
        try {
            if (!this.cacheClient) return;

            const cacheKey = this.createKey(prefix, key);
            await promisify(this.cacheClient.del).bind(this.cacheClient, cacheKey)();
        } catch (error) {
            // Ignore error
            SentryCaptureException(error);
        }
    }

    async getExpiration(prefix: string, key: string): Promise<number | null> {
        try {
            if (!this.cacheClient) return null;

            const cacheKey = this.createKey(prefix, key);
            return await promisify(this.cacheClient.TTL).bind(this.cacheClient, cacheKey)();
        } catch (error) {
            SentryCaptureException(error);
            return null;
        }
    }

    async updateExpirationTime(prefix: string, key: string, expirationTime: CacheExpiration): Promise<void | null> {
        try {
            if (!this.cacheClient || !expirationTime) return;

            const cacheKey = this.createKey(prefix, key);

            await promisify(this.cacheClient.expire).bind(
                this.cacheClient,
                cacheKey,
                this.getExpirationTime(expirationTime),
            )();
        } catch (error) {
            SentryCaptureException(error);
            return null;
        }
    }

    private createKey(prefix: string, key: string): string {
        const hashedKey = Md5.hashStr(key).toString();
        return `${prefix}:${hashedKey}`;
    }

    private getExpirationTime(expirationTime: CacheExpiration) {
        return expirationTime.hours * 60 * 60 + expirationTime.minutes * 60;
    }
}
