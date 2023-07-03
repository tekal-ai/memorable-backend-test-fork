import {IncomingWebhook} from "@slack/webhook";
import {Service} from "typedi";
import {Config} from "../config/Config";
import {INotification} from "./INotification";

@Service()
export class SlackNotificationSender {
    private webhook: IncomingWebhook;

    constructor() {
        this.webhook = new IncomingWebhook(Config.slack.webhooksUrl);
    }

    async send(notification: INotification) {
        /*eslint-disable-next-line @typescript-eslint/no-floating-promises */ // background task
        this._send(notification);
    }

    async _send(notification: INotification) {
        try {
            await this.webhook.send({
                text: notification.getMessage(),
            });
        } catch {
            // Ignore error
        }
    }
}
