import {Field, ObjectType} from "type-graphql";

@ObjectType()
class PresignedData {
    @Field()
    url!: string;
    @Field()
    fields!: string;
}

@ObjectType()
export class UploadDataResponse {
    @Field()
    id!: string;
    @Field()
    originalUrl!: string;
    @Field()
    presignedData!: PresignedData;
}
