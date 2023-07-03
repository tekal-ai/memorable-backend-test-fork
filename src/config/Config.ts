import {ConfigLocal} from "./Config.local";
import {ConfigTests} from "./Config.tests";
import {IConfig} from "./IConfig";

const configs: {[key: string]: IConfig} = {
    test: ConfigTests,
    local: ConfigLocal,
};
const env = process.env.NODE_ENV || "local";
const config = configs[env];
export {config as Config};

export class ConfigConstants {
    static CONTACT_EMAIL = "contact@memorable.io";
    static DASHBOARD_URL = "https://app.memorable.io";
    static ADMIN_EMAIL = "localuser@memorable.io";
}
