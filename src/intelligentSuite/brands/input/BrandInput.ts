import {Field, InputType, Int} from "type-graphql";
import {AdAccountType, SocialAccountType} from "../../common/entities/Assets";
import {Sector} from "../../common/entities/Sector";
import {ValidBrandStatus} from "../entities/BrandStatus";

@InputType()
export class CreateBrandInput {
    @Field(() => String)
    name!: string;
    @Field(() => String, {nullable: true})
    logoUrl?: string;
    @Field(() => [Sector])
    sector!: Sector[];
}

@InputType()
export class UpdateBrandInput {
    @Field(() => String, {nullable: true})
    name?: string;

    @Field(() => String, {nullable: true})
    logoUrl?: string;

    @Field(() => [Sector], {nullable: true})
    sector?: Sector[];
}
@InputType()
export class BrandAssetsInput {
    @Field(() => [AdAccountInput], {nullable: true})
    adAccount?: AdAccountInput[];
    @Field(() => [SocialAccountInput], {nullable: true})
    socialAccount?: SocialAccountInput[];
}

@InputType()
export class BrandStatusInput {
    @Field(() => ValidBrandStatus)
    status!: ValidBrandStatus;
}

@InputType()
export class SocialAccountInput {
    @Field(() => Int)
    id!: number;
    @Field(() => SocialAccountType)
    type!: SocialAccountType;
}

@InputType()
export class AdAccountInput {
    @Field(() => Int)
    id!: number;
    @Field(() => AdAccountType)
    type!: AdAccountType;
}

@InputType()
export class BrandTopicInput {
    @Field(() => String)
    topic!: string;
}

@InputType()
export class BrandColorPalleteInput {
    @Field(() => String)
    color!: string;
}

@InputType()
export class BrandLogoVariantInput {
    @Field(() => String)
    logoVariant!: string;
}
