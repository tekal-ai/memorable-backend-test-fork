import {createParamDecorator} from "type-graphql";
import {UserAuthenticator} from "../../intelligentSuite/users/auth/Authenticate";
import {User} from "../../intelligentSuite/users/entities/User";
import {ApiContext} from "../../server/serverOptions";

/* Gets current user from Graphql context */
export function CurrentUser() {
    return createParamDecorator<ApiContext>(async ({context}): Promise<User> => {
        return new UserAuthenticator().authenticate(context);
    });
}
