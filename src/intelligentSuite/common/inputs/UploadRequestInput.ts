import {Field, InputType} from "type-graphql";

@InputType()
export class UploadRequestInput {
    @Field()
    mimeType!: string;
    @Field()
    extension!: string;
}
