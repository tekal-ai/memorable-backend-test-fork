import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class IntegrationsAssets {
    @Field(() => [AdAccount], {nullable: true})
    adAccounts?: AdAccount[];
    @Field(() => [SocialAccount], {nullable: true})
    socialAccounts?: SocialAccount[];
}

export enum AdAccountType {
    MetaAdAccount = "MetaAdAccount",
    TiktokAdAccount = "TiktokAdAccount",
}
export enum SocialAccountType {
    FacebookPage = "FacebookPage",
    InstagramAccount = "InstagramAccount",
    TiktokAccount = "TiktokAccount",
}

@ObjectType()
export class AdAccount {
    @Field(() => ID)
    id!: number;
}

@ObjectType()
export class SocialAccount {
    @Field(() => ID)
    id!: number;
}
