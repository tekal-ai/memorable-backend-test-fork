import {Field, InputType} from "type-graphql";

@InputType()
export class CreateBusinessAccountInput {
    @Field(() => String, {nullable: false})
    businessName!: string;
}

@InputType()
export class UpdateBusinessAccountInput {
    @Field(() => String, {nullable: true})
    businessName?: string;

    @Field(() => String, {nullable: true})
    address?: string;

    @Field(() => String, {nullable: true})
    businessPhone?: string;

    @Field(() => String, {nullable: true})
    website?: string;

    @Field(() => String, {nullable: true})
    businessLogoUrl?: string;
}
