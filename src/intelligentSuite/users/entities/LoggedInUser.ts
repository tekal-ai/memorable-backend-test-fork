import {Field, ObjectType} from "type-graphql";
import {SessionToken} from "../auth/JWTAuth";

@ObjectType()
export class LoggedInUser {
    @Field(() => String)
    sessionToken!: SessionToken;
}
