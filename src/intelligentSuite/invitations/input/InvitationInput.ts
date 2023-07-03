import {Field, InputType} from "type-graphql/dist/decorators";
import {Int} from "type-graphql/dist/scalars";

@InputType()
export class InvitationInput {
    @Field({nullable: true})
    email?: string;
    @Field(() => Boolean, {nullable: true, defaultValue: false})
    isAdmin = false;
    @Field(() => Int, {nullable: true, defaultValue: 1})
    numberOfInvitations = 1;
}
