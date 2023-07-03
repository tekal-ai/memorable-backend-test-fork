import Container from "typedi";
import {getRepository} from "typeorm";
import {Cache} from "../../../cache/Cache";
import {UnauthorizedError} from "../../../common/errors/UnauthorizedError";
import {Config, ConfigConstants} from "../../../config/Config";
import {User} from "../../../intelligentSuite/users/entities/User";
import {SentryInit} from "../../../sentry/sentryInitialization";
import {ApiContext} from "../../../server/serverOptions";
import {JWTAuth} from "./JWTAuth";

type AuthToken = {
    type: "Bearer" | "ApiKey";
    token: string;
};

export class UserAuthenticator {
    private readonly idleTimeout = {hours: 0, minutes: 30};

    async authenticate(context: ApiContext): Promise<User> {
        const token = UserAuthenticator.getAuthTokenFromContext(context);

        if (!token) throw new UnauthorizedError();

        let user: User | undefined;

        if (token.type === "ApiKey") {
            user = await this.authenticateApiKey(token.token);
        } else {
            user = await this.authenticateJWT(token.token);
        }

        if (!user) {
            throw new UnauthorizedError();
        }

        SentryInit().setUser({
            id: user.id,
            email: user.email,
        });

        return user;
    }

    async logout(token: string, userId: string) {
        await this.removeTokenFromCache(token, userId);
    }

    static getAuthTokenFromContext(context: ApiContext): AuthToken | undefined {
        const authToken = context.headers.Authorization || context.headers.authorization;

        if (authToken?.startsWith("Bearer ")) {
            return {
                type: "Bearer",
                token: authToken.replace("Bearer ", ""),
            };
        } else if (authToken?.startsWith("ApiKey ")) {
            return {
                type: "ApiKey",
                token: authToken.replace("ApiKey ", ""),
            };
        }

        return undefined;
    }

    // @CacheResponse(User, {hours: 0, minutes: 10}, "v3")
    private async getUser(userId: string): Promise<User | undefined> {
        return await getRepository(User).findOne(userId);
    }

    public async getUserFromCache(token: string, userId: string) {
        const {cache, cacheKey, cachePrefix} = this.getAuthCacheConfig(token, userId);
        return await cache.get(cachePrefix, cacheKey, String);
    }

    private async removeTokenFromCache(token: string, userId: string) {
        const {cacheKey, cachePrefix, cache} = this.getAuthCacheConfig(token, userId);
        await cache.deleteKey(cachePrefix, cacheKey);
    }

    public getIdleTimeout() {
        return this.idleTimeout;
    }

    public getAuthCacheConfig(token: string, userId: string) {
        const cache = Container.get(Cache);
        const cachePrefix = `jwt.${userId}`;
        const cacheKey = token;

        return {cachePrefix, cacheKey, cache};
    }

    private async authenticateJWT(token: string) {
        const auth = new JWTAuth().decodeSession(token);

        if (!auth.isSuccessful()) {
            throw new UnauthorizedError();
        }

        const idleTimeout = await this.getIdleTimeoutTokenOnCache(token, auth.getData().userId);
        if (idleTimeout && idleTimeout <= 0) {
            throw new UnauthorizedError();
        }

        const userId = auth.getData().userId;
        const {cache, cacheKey, cachePrefix} = this.getAuthCacheConfig(token, userId);

        if (!this.getUserFromCache(token, userId)) {
            throw new UnauthorizedError();
        }

        await cache.updateExpirationTime(cachePrefix, cacheKey, this.getIdleTimeout());
        return await this.getUser(userId);
    }

    public async setIdleTimeoutTokenOnCache(token: string, userId: string) {
        const {cacheKey, cachePrefix, cache} = this.getAuthCacheConfig(token, userId);
        await cache.set(cachePrefix, cacheKey, token, this.getIdleTimeout());
    }

    private async getIdleTimeoutTokenOnCache(token: string, userId: string) {
        const {cacheKey, cachePrefix, cache} = this.getAuthCacheConfig(token, userId);
        return await cache.getExpiration(cachePrefix, cacheKey);
    }

    private async authenticateApiKey(token: string) {
        if (token !== Config.pipeline.apiKey) {
            throw new UnauthorizedError();
        }

        return await getRepository(User).findOne({where: {email: ConfigConstants.ADMIN_EMAIL}});
    }
}
