import {Config} from "../../config/Config";
import {User} from "../../intelligentSuite/users/entities/User";
import {EmailParams, IEmail} from "../IEmail";

export class VerifyEmail implements IEmail {
    constructor(private readonly user: User) {
        this.user = user;
    }

    getParams(): EmailParams {
        return {
            USER_EMAIL: this.user.email,
            VERIFICATION_CODE: this.user.emailCode || "",
            USER_ID: this.user.id,
            VERIFY_LINK: `${Config.url}/verify-email?userId=${this.user.id}&code=${this.user.emailCode}`,
        };
    }

    getTemplateName(): string {
        return "verify-email";
    }
}
