import {Field} from "type-graphql/dist/decorators/Field";
import {ObjectType} from "type-graphql/dist/decorators/ObjectType";
import {AdAccount, SocialAccount} from "../../common/entities/Assets";

@ObjectType()
export class BrandAssetsResponse {
    @Field(() => [AdAccount], {nullable: true})
    adAccounts?: AdAccount[];
    @Field(() => [SocialAccount], {nullable: true})
    socialAccounts?: SocialAccount[];
}
