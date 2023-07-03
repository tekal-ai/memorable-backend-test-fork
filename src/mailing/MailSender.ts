import Mailchimp, {
    MergeVar,
    SendTemplateMessageRequest,
    SendTemplateMessageResponse,
} from "@mailchimp/mailchimp_transactional";
import {Container, Inject, Service} from "typedi";
import {Result} from "../common/Result";
import {Config} from "../config/Config";
import {EmailParams, IEmail} from "./IEmail";

import {SentryCaptureException} from "../sentry/sentryExceptions";

export const MAILCHIMP_DI = "Mailchimp";
Container.set(MAILCHIMP_DI, Mailchimp(Config.mailing.mailchimpApiKey));

@Service()
export class MailSender {
    public constructor(@Inject(MAILCHIMP_DI) private client: Mailchimp.ApiClient) {}

    async sendEmail(email: IEmail, recipients: string[]): Promise<void> {
        /*eslint-disable-next-line @typescript-eslint/no-floating-promises */ // background task
        this._sendEmail(email, recipients);
    }

    private async _sendEmail(email: IEmail, recipients: string[]): Promise<Result<string>> {
        if (recipients.length === 0) {
            return Result.Success("No recipients");
        }

        const request: SendTemplateMessageRequest = {
            template_name: email.getTemplateName(),
            template_content: [],
            message: {
                to: recipients.map((recipient) => {
                    return {email: recipient, type: "to"};
                }),
                global_merge_vars: this.generateMergeVars(email.getParams()),
            },
        };

        const response = await this.client.messages.sendTemplate(request);
        return this.handleResponse(response);
    }

    private handleResponse(response: SendTemplateMessageResponse | Error): Result<string> {
        console.log(`Mailchimp response: ${JSON.stringify(response)}`);

        if (response instanceof Error) {
            SentryCaptureException(response);
            return Result.Exception(response);
        }
        if (response.length > 0 && response[0].reject_reason) {
            SentryCaptureException(response[0].reject_reason);
            return Result.Error(`Failed to send email: ${response[0].reject_reason}`);
        }
        return Result.Success("success");
    }

    private generateMergeVars(params: EmailParams): MergeVar[] {
        const keys = Object.keys(params);
        return keys.map((key) => {
            return {
                name: key,
                content: params[key],
            };
        });
    }
}
