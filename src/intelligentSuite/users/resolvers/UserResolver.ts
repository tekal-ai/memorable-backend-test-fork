import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorCode} from "../../../common/errors/ErrorCode";
import {UnauthorizedError} from "../../../common/errors/UnauthorizedError";
import {CurrentUser} from "../../../graphql/decorators/currentUserDecorator";
import {ApiContext} from "../../../server/serverOptions";
import {UserAuthenticator} from "../auth/Authenticate";
import {JWTAuth} from "../auth/JWTAuth";
import {LoggedInUser} from "../entities/LoggedInUser";
import {User} from "../entities/User";
import {AuthenticationInput, SignUpInput, UserProfileInput} from "../input/UserInput";
import {AuthService} from "../services/AuthService";
import {UserService} from "../services/UserService";

@Service()
@Resolver()
export class UserResolver {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

    @Mutation((_returns) => LoggedInUser, {description: "Log in user"})
    async logIn(@Arg("input") input: AuthenticationInput) {
        return await this.authService.logIn(input);
    }

    @Mutation((_returns) => String, {description: "Refresh log in token"})
    async refreshLogInToken(@Ctx() context: ApiContext) {
        const token = UserAuthenticator.getAuthTokenFromContext(context);
        if (!token || token.type !== "Bearer") throw new BadRequestError("Invalid token type");

        const newToken = new JWTAuth().refresh(token.token);
        newToken.throwIfError();
        return newToken.getData();
    }

    @Query((_returns) => User, {nullable: true, description: "Get logged in user or NULL if it is not logged in"})
    async getLoggedInUser(@Ctx() context: ApiContext) {
        try {
            return await new UserAuthenticator().authenticate(context);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return null;
            }
            throw error;
        }
    }

    @Mutation((_returns) => User, {
        description: `Update user profile. If setting new password and current password is invalid, ${ErrorCode.BAD_REQUEST} is thrown`,
    })
    async updateUserProfile(@Arg("input") input: UserProfileInput, @CurrentUser() currentUser: User) {
        return await this.userService.updateProfile(currentUser, input);
    }

    @Mutation((_returns) => Boolean, {description: `Accept terms and conditions for current user`})
    async acceptTermsAndConditions(@CurrentUser() currentUser: User) {
        await this.userService.acceptTermsAndConditions(currentUser);
        return true;
    }

    @Mutation((_returns) => User, {description: `Create the new User using a Invitation Code`})
    async signUp(@Arg("user") input: SignUpInput, @Arg("code") code: string) {
        return await this.userService.signUp(input, code);
    }

    @Mutation(() => Boolean, {description: "Logout user"})
    async logout(@CurrentUser() currentUser: User, @Ctx() context: ApiContext) {
        const authData = UserAuthenticator.getAuthTokenFromContext(context);

        if (!authData || authData.type !== "Bearer") throw new BadRequestError("Invalid token type");

        await new UserAuthenticator().logout(authData.token, currentUser.id);
        return true;
    }
}
