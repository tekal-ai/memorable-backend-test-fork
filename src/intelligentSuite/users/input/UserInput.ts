import {Field, InputType} from "type-graphql";
import {BusinessAccount} from "../../businessAccounts/entities/BusinessAccount";

@InputType()
export class UserInvitedInput {
    @Field(() => String, {nullable: false})
    email!: string;
}

@InputType()
export class AuthenticationInput {
    @Field()
    email!: string;

    @Field()
    password!: string;
}

@InputType()
export class SignUpInput {
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;
}

@InputType()
export class UserCreateInput {
    @Field(() => String, {nullable: false, description: "Business id"})
    businessEntityId!: string;

    @Field(() => [UserInfo])
    userInfo!: UserInfo[];
}

@InputType()
export class UserInfo {
    @Field(() => String, {nullable: false})
    name!: string;
    @Field(() => String, {nullable: false})
    email!: string;
    @Field(() => BusinessAccount, {nullable: true})
    businessAccount?: BusinessAccount;
    @Field(() => String, {nullable: true})
    password?: string;

    @Field(() => Boolean, {nullable: true})
    isAdmin?: boolean;
}

@InputType()
export class InvitedUserInfo {
    @Field(() => String)
    email!: string;
}

@InputType()
export class UserProfileInput {
    @Field({nullable: true})
    name?: string;

    @Field({nullable: true, description: "Required if 'New Password' is sent. Must match current user password."})
    currentPassword?: string;

    @Field({nullable: true, description: "Requires 'Current Password' to also be sent"})
    newPassword?: string;
}
