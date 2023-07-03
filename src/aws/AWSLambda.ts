import AWS from "aws-sdk";
import {Service} from "typedi";
import {Result} from "../common/Result";
import {Config} from "../config/Config";
import {SentryCaptureException} from "../sentry/sentryExceptions";

@Service()
export class AWSLambda {
    private lambda: AWS.Lambda;

    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.update({
            region: Config.aws.region,
            accessKeyId: Config.aws.accessKeyId,
            secretAccessKey: Config.aws.secretAccessKey,
        });
        this.lambda = new AWS.Lambda();
    }

    async invokeWithBody<T>(functionName: string, params: T): Promise<Result<string>> {
        const bodyParams = {body: JSON.stringify(params)};
        return await this.invoke(functionName, bodyParams);
    }

    async invoke<T>(functionName: string, params: T): Promise<Result<string>> {
        console.log(`Invoking lambda function '${functionName}' with params: ${JSON.stringify(params)}`);
        if (Config.local) return Result.Success("success");

        try {
            await new Promise((resolve, _reject) =>
                this.lambda.invokeAsync(
                    {
                        InvokeArgs: JSON.stringify(params),
                        FunctionName: functionName,
                    },
                    (_error, result) => {
                        resolve(result);
                    },
                ),
            );
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
