import {Service} from "typedi";
import {Cache} from "../../../cache/Cache";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {TooManyRequestsError} from "../../../common/errors/TooManyRequestsError";
import {UnauthorizedError} from "../../../common/errors/UnauthorizedError";
import {Logger} from "../../../logging/Logger";
import {UserAuthenticator} from "../auth/Authenticate";
import {JWTAuth} from "../auth/JWTAuth";
import {AuthenticationInput} from "../input/UserInput";
import {UserVerifyEmailInput} from "../input/UserVerifyEmailInput";
import {UserRepository} from "../repositories/UserRepository";

@Service()
export class AuthService {
    private readonly maxNumberOfFailedLogins = 10;
    private readonly timeWindowForFailedLoginsInMinutes = 15;
    private logger: Logger;

    constructor(private readonly userRepository: UserRepository, private readonly cache: Cache) {
        this.logger = new Logger(AuthService);
    }

    async logIn(input: AuthenticationInput) {
        this.logger.verbose(this.logIn.name, "started");
        const user = await this.userRepository.getByEmail(input.email);
        this.logger.debug(this.logIn.name, "current user:", {email: user?.email || ""});

        if (!user) {
            throw new UnauthorizedError("User not found", this.logger, this.logIn.name);
        }

        const userAttempts = await this.getUserAttempts(user.id);
        if (userAttempts && userAttempts > this.maxNumberOfFailedLogins) {
            throw new TooManyRequestsError(
                "Too many failed login attempts " + this.timeWindowForFailedLoginsInMinutes,
                this.logger,
                this.logIn.name,
            );
        }

        if (!user.verifyPassword(input.password)) {
            await this.increaseUserAttempts(user.id, userAttempts);
            throw new UnauthorizedError(ErrorMsg.PASSWORD_DO_NOT_MATCH, this.logger, this.logIn.name);
        }

        user.lastLogin = new Date();
        await this.userRepository.save(user);
        await this.deleteUserAttempts(user.id);

        const sessionToken = new JWTAuth().encodeSession({userId: user.id});

        await new UserAuthenticator().setIdleTimeoutTokenOnCache(sessionToken, user.id);

        this.logger.info(this.logIn.name, "user logged in", {email: user.email});
        this.logger.verbose(this.logIn.name, "finished");
        return {
            user,
            sessionToken,
        };
    }

    async verifyEmail(input: UserVerifyEmailInput) {
        let user = await this.userRepository.getById(input.userId);
        if (!user) throw new BadRequestError();

        if (user.emailCode !== input.code) throw new BadRequestError("Invalid code");

        user.verifyEmail(user);
        user = await this.userRepository.save(user);

        return user;
    }

    private getCacheConfig(userId: string) {
        const prefix = `userAttempts`;
        const key = userId;

        return {prefix, key};
    }

    private async getUserAttempts(userId: string) {
        const {key, prefix} = this.getCacheConfig(userId);
        return (await this.cache.get(prefix, key, Number)) as number;
    }

    private async deleteUserAttempts(userId: string) {
        const {key, prefix} = this.getCacheConfig(userId);
        await this.cache.deleteKey(prefix, key);
    }

    private async increaseUserAttempts(userId: string, userAttempts: number) {
        const {key, prefix} = this.getCacheConfig(userId);
        await this.cache.set(prefix, key, userAttempts + 1, {
            hours: 0,
            minutes: this.timeWindowForFailedLoginsInMinutes,
        });
    }
}
