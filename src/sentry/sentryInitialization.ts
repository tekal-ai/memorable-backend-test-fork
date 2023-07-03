import * as Sentry from "@sentry/serverless";
import {Config} from "../config/Config";

export const SentryInit = () => {
    Sentry.init({
        dsn: Config.sentryDSN,
        tracesSampleRate: 0.5,
        enabled: !Config.local,
        environment: `Dashboard Backend: ${process.env.NODE_ENV || "local"}`,
    });
    return Sentry;
};
