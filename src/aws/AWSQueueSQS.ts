import AWS from "aws-sdk";
import {MessageAttributeMap} from "aws-sdk/clients/sns";
import {Md5} from "ts-md5";
import {Service} from "typedi";
import {Result} from "../common/Result";
import {Config} from "../config/Config";
import {SentryCaptureException} from "../sentry/sentryExceptions";

@Service()
export class AWSQueueSQS {
    private sqs: AWS.SQS;

    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.update({
            region: Config.aws.region,
            accessKeyId: Config.aws.accessKeyId,
            secretAccessKey: Config.aws.secretAccessKey,
        });
        this.sqs = new AWS.SQS();
    }

    async sendMessageFifo<T>(
        queueUrl: string,
        body: T,
        messageGroupId?: string,
        attributes?: MessageAttributeMap,
    ): Promise<Result<string>> {
        const jsonBody = JSON.stringify(body);
        return await this.sendMessageToQueue(
            queueUrl,
            body,
            messageGroupId ?? Md5.hashStr(jsonBody).toString(),
            attributes,
        );
    }

    async sendMessage<T>(queueUrl: string, body: T): Promise<Result<string>> {
        return await this.sendMessageToQueue(queueUrl, body);
    }

    private async sendMessageToQueue<T>(
        queueUrl: string,
        body: T,
        messageGroupId?: string,
        attributes?: MessageAttributeMap,
    ): Promise<Result<string>> {
        if (Config.local) {
            return Result.Success("success");
        }

        try {
            const jsonBody = JSON.stringify(body);
            console.log("Sending message to queue", queueUrl, jsonBody);

            // Send a message into SQS
            const queueData = await this.sqs
                .sendMessage(
                    {
                        QueueUrl: queueUrl,
                        MessageBody: jsonBody,
                        MessageGroupId: messageGroupId,
                        MessageAttributes: attributes,
                    },
                    (err, data) => {
                        if (err) {
                            console.log(err);
                        }

                        return data;
                    },
                )
                .promise();

            console.log(`Queue response: ${JSON.stringify(queueData)}`);

            return Result.Success("success");
        } catch (error) {
            SentryCaptureException(error);
            if (error instanceof Error) {
                return Result.Exception(error);
            }
            throw error;
        }
    }
}
