import {DataMapper} from "@aws/dynamodb-data-mapper";
import {DynamoDB} from "aws-sdk";
import "reflect-metadata";
import {Container} from "typedi";
import {Config} from "../config/Config";

export const DYNAMO_DB = "DynamoDB";
export type DynamoDb = DataMapper;

export const createDynamoDB = async () => {
    const client = new DynamoDB({
        accessKeyId: Config.aws.accessKeyId,
        secretAccessKey: Config.aws.secretAccessKey,
        region: Config.aws.region,
    });

    const mapper = new DataMapper({client});

    Container.set(DYNAMO_DB, mapper);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isDynamoNotFoundError(error: any): boolean {
    return error instanceof Error && error.name === "ItemNotFoundException";
}
