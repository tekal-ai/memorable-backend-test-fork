export type EmailParams = {[key: string]: string};

export interface IEmail {
    /* Template identifier (slug) in client */
    getTemplateName(): string;

    /* Variables used in the email template */
    getParams(): EmailParams;
}
