/* eslint-disable @typescript-eslint/no-explicit-any */
import {ErrorCode} from "../common/errors/ErrorCode";
import {Config} from "../config/Config";
import {SentryCaptureException} from "./sentryExceptions";
import {SentryInit} from "./sentryInitialization";

const IGNORED_ERRORS = [ErrorCode.UNAUTHORIZED, ErrorCode.NOT_FOUND, ErrorCode.CONFLICT];
const NON_PROD_IGNORED_ERRORS = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.NOT_FOUND,
    ErrorCode.FORBIDDEN,
    ErrorCode.BAD_REQUEST,
    ErrorCode.BAD_USER_INPUT,
    ErrorCode.CONFLICT,
];

export const sentryConfig = {
    async requestDidStart(_: any): Promise<any> {
        return {
            didEncounterErrors(ctx: any) {
                const ignoredErrors = Config.production ? IGNORED_ERRORS : NON_PROD_IGNORED_ERRORS;

                // If we couldn't parse the operation (usually invalid queries)
                if (!ctx.operation) {
                    for (const err of ctx.errors) {
                        if (ignoredErrors.includes(err.extensions.code)) return;

                        SentryInit().withScope((scope) => {
                            scope.setExtra("query", ctx.request.query);
                            SentryCaptureException(err);
                        });
                    }
                    return;
                }

                for (const err of ctx.errors) {
                    if (ignoredErrors.includes(err.extensions.code)) return;

                    // Add scoped report details and send to Sentry
                    SentryInit().withScope((scope: any) => {
                        // Annotate whether failing operation was query/mutation/subscription
                        scope.setTag("kind", ctx.operation.operation);

                        // Log query and variables as extras (make sure to strip out sensitive data!)
                        scope.setExtra("query", JSON.stringify(ctx.request.query));
                        scope.setExtra("variables", JSON.stringify(ctx.request.variables));
                        scope.setExtra("extensions", JSON.stringify(err.extensions));

                        if (err.path) {
                            // We can also add the path as breadcrumb
                            scope.addBreadcrumb({
                                category: "query-path",
                                message: err.path.join(" > "),
                                level: "debug",
                            });
                        }

                        const transactionId = ctx.request.http.headers.get("x-transaction-id");
                        if (transactionId) {
                            scope.setTransactionName(transactionId);
                        }

                        SentryCaptureException(err);
                    });
                }
            },
        };
    },
};
