import {Field, InputType, ObjectType} from "type-graphql";
import {Channel} from "./Channel";

@ObjectType()
export class Tag {
    @Field(() => String, {nullable: true})
    tagSuperClass?: string;
    @Field(() => String)
    tagClass!: string;
    @Field(() => String)
    tagValue!: string;
    @Field({nullable: true})
    importance?: number;
}

@InputType()
export class TagInput extends Tag {
    @Field(() => String, {nullable: true})
    tagSuperClass?: string;
    @Field(() => String)
    tagClass!: string;
    @Field(() => String)
    tagValue!: string;
    @Field(() => Channel, {nullable: true})
    channel?: Channel;
}

@InputType()
export class TagFilterInput {
    @Field(() => String, {nullable: true})
    tagSuperClass?: string;
    @Field(() => String, {nullable: true})
    tagClass?: string;
    @Field(() => String, {nullable: true})
    tagValue?: string;
}

@ObjectType()
export class TagFilter {
    @Field(() => String, {nullable: true})
    tagSuperClass?: string;
    @Field(() => String, {nullable: true})
    tagClass?: string;
    @Field(() => String, {nullable: true})
    tagValue?: string;
}
