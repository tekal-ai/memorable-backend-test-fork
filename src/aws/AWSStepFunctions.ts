import AWS from "aws-sdk";
import {Service} from "typedi";
import {Result} from "../common/Result";
import {Config} from "../config/Config";
import {SentryCaptureException} from "../sentry/sentryExceptions";

@Service()
export class AWSStepFunctions {
    private stepFunctions: AWS.StepFunctions;

    constructor() {
        AWS.config = new AWS.Config();
        AWS.config.update({
            region: Config.aws.region,
            accessKeyId: Config.aws.accessKeyId,
            secretAccessKey: Config.aws.secretAccessKey,
        });
        this.stepFunctions = new AWS.StepFunctions();
    }

    async startExecution<T>(stepFunctionsArn: string, body: T): Promise<Result<string>> {
        if (Config.local) return Result.Success("success");

        const jsonBody = JSON.stringify(body);
        try {
            await new Promise((resolve, _reject) =>
                this.stepFunctions.startExecution(
                    {stateMachineArn: stepFunctionsArn, input: jsonBody},
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
