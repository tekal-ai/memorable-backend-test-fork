import {Field, InputType, Int} from "type-graphql";
import {AdAccountType, SocialAccountType} from "../../common/entities/Assets";
import {Sector} from "../../common/entities/Sector";
import {BrandStatus} from "../entities/BrandStatus";

@InputType()
export class CreateBrandInput {
    @Field(() => String, {description: "Name of brand"})
    name!: string;
    @Field(() => String, {nullable: true, description: "Logo URL of brand"})
    logoUrl?: string;
    @Field(() => [Sector], {description: "List of sectors related to the brand"})
    sector!: Sector[];
}

@InputType()
export class UpdateBrandInput {
    @Field(() => String, {nullable: true, description: "Name of brand"})
    name?: string;

    @Field(() => String, {nullable: true, description: "Logo URL of brand"})
    logoUrl?: string;

    @Field(() => [Sector], {nullable: true, description: "List of sectors related to the brand"})
    sector?: Sector[];
}

@InputType()
export class BrandAssetsInput {
    @Field(() => [AdAccountInput], {
        nullable: true,
        description: "List of Ad Accounts associated with the brand",
    })
    adAccount?: AdAccountInput[];
    @Field(() => [SocialAccountInput], {
        nullable: true,
        description: "List of Social Accounts associated with the brand",
    })
    socialAccount?: SocialAccountInput[];
}

@InputType()
export class SocialAccountInput {
    @Field(() => Int, {description: "Social Account ID"})
    id!: number;
    @Field(() => SocialAccountType, {description: "Social Account Type"})
    type!: SocialAccountType;
}

@InputType()
export class AdAccountInput {
    @Field(() => Int, {description: "Ad Account ID"})
    id!: number;
    @Field(() => AdAccountType, {description: "Ad Account Type"})
    type!: AdAccountType;
}

@InputType()
export class BrandTopicInput {
    @Field(() => String, {description: "Topic of the brand"})
    topic!: string;
}

@InputType()
export class BrandColorPalleteInput {
    @Field(() => String, {description: "Color code of the brand"})
    color!: string;
}

@InputType()
export class BrandLogoVariantInput {
    @Field(() => String, {description: "Logo variant associated with the brand"})
    logoVariant!: string;
}

@InputType()
export class BrandStatusInput {
    @Field(() => BrandStatus, {
        description: "Status of the brand. Possible values: IN_PROGRESS, DATA_READY, MODEL_TRAINING, READY",
    })
    status!: BrandStatus;
}
