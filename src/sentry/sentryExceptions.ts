import {SentryInit} from "./sentryInitialization";

export const SentryCaptureException = (error: unknown) => {
    SentryInit().captureException(error);
};
