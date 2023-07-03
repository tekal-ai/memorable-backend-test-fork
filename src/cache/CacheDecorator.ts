import {ClassConstructor} from "class-transformer/types/interfaces";
import {Container} from "typedi";
import {BaseEntity} from "../common/entities/BaseEntity";
import {Config} from "../config/Config";
import {Cache, CacheExpiration} from "./Cache";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/promise-function-async, @typescript-eslint/no-floating-promises */

/*
 * Decorator to cache the result of a function.
 * Works for any function that returns an object that works with JSON.stringify.
 *
 * DO NOT use it in methods in Abstract classes or in methods that depend on attributes in constructor.
 *
 * @param expirationTime - time in seconds to keep the result in cache
 * @param version - version of the cached method, increase the version to clean cache
 *
 * Usage: @CacheResponse(EntityClass, {hours: 1, minutes: 0}, "v1")
 */
export const CacheResponse = <T>(
    resultClass: ClassConstructor<T>,
    expirationTime: CacheExpiration,
    version: string,
) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]): Promise<T> {
            const cache = Container.get(Cache);
            return new Promise<T>((resolve, reject) => {
                const cachePrefix = `${target.constructor.name}.${propertyKey}`;
                let cacheKey = `${cachePrefix}.${version}.${resultClass.name}`;

                args.forEach((arg: any) => {
                    cacheKey += "-" + generateArgCacheKey(arg);
                });

                cache.get(cachePrefix, cacheKey, resultClass).then((cachedValue) => {
                    // Check if there already is a cached result and return it
                    if (cachedValue !== null) {
                        if (Config.local) console.log(`Cache hit for ${cacheKey}`);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore  because of wrong types
                        resolve(cachedValue);
                        return;
                    }

                    // Call the original method and store the result in the cache
                    originalMethod
                        .apply(this, args)
                        .then(async (result: T) => {
                            cache.set(cachePrefix, cacheKey, result, expirationTime).then(() => {
                                if (Config.local) console.log(`Cache set for ${cacheKey}`);
                                resolve(result);
                            });
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            });
        };
    };
};

const generateArgCacheKey = (arg: any): string => {
    if (Array.isArray(arg)) {
        return `[${arg.map((item) => generateArgCacheKey(item)).join("|")}]`;
    }
    if (arg instanceof BaseEntity) {
        return arg.constructor.name + "." + arg.id;
    }

    return JSON.stringify(arg);
};
