import {createClient, RedisClient} from "redis";
import "reflect-metadata";
import {Container} from "typedi";
import {Config} from "../config/Config";

export const CACHE_CLIENT = "CACHE_CLIENT";
export type CacheClient = RedisClient | null;

export const createCacheClient = async () => {
    let cacheUrl = Config.cacheUrl;

    if (!cacheUrl) {
        Container.set(CACHE_CLIENT, null);
        return;
    }

    if (!cacheUrl.startsWith("redis://")) {
        cacheUrl = `redis://${cacheUrl}`;
    }

    const client = createClient({url: cacheUrl});

    client.on("error", (err) => console.log("Redis Client Error", err));

    Container.set(CACHE_CLIENT, client);
};
