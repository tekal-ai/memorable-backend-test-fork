import {decode, encode, TAlgorithm} from "jwt-simple";
import {Result} from "../../../common/Result";
import {Config} from "../../../config/Config";

export interface Session {
    /* User information. */
    userId: string;

    /* Timestamp indicating when the session was created, in Unix milliseconds. */
    issued: number;

    /* Timestamp indicating when the session should expire, in Unix milliseconds. */
    expires: number;
}

export type PartialSession = Omit<Session, "issued" | "expires">;

export type SessionToken = string;

export class JWTAuth {
    private algorithm: TAlgorithm = "HS512";
    private expiration = 3 * 60 * 60 * 1000; // 3 hours
    private refreshExpiration = 7 * 24 * 60 * 60 * 1000; // 1 week

    encodeSession(partialSession: PartialSession): SessionToken {
        const issued = Date.now();
        const expires = issued + this.expiration;
        const session: Session = {
            ...partialSession,
            issued: issued,
            expires: expires,
        };

        return encode(session, Config.jwtSecret, this.algorithm);
    }

    decodeSession(tokenString?: string): Result<Session> {
        if (!tokenString) {
            return Result.Error("No token");
        }

        try {
            const token: Session = decode(tokenString, Config.jwtSecret, false, this.algorithm);
            if (token.expires > Date.now()) {
                return Result.Success(token);
            }
            return Result.Error("Token has expired");
        } catch (error) {
            if (error instanceof Error) {
                return Result.Exception(error);
            }
            throw error;
        }
    }

    refresh(token?: string): Result<SessionToken> {
        if (!token) {
            return Result.Error("No token");
        }

        try {
            const session: Session = decode(token, Config.jwtSecret, false, this.algorithm);
            if (session.expires + this.refreshExpiration > Date.now()) {
                return Result.Success(this.encodeSession(session));
            }
            return Result.Error("Expired token");
        } catch (error) {
            if (error instanceof Error) {
                return Result.Exception(error);
            }
            throw error;
        }
    }
}
