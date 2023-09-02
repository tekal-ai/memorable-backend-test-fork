import {ApolloServer} from "apollo-server-express";
import "dotenv/config";
import {default as Express, Request, Response} from "express";
import {execute, subscribe} from "graphql";
// import {graphqlUploadExpress} from "graphql-upload";
import helmet from "helmet";
import {createServer} from "http";
import "reflect-metadata";
import {SubscriptionServer} from "subscriptions-transport-ws";
import {createCacheClient} from "../cache/cacheConnection";
import {Config} from "../config/Config";
import {createDB} from "../database/databaseConnection";
import {createDynamoDB} from "../database/dynamoDbConnection";
import {MongoDbConnection} from "../database/mongoDbConnection";
import {graphqlSchema} from "../graphql/graphqlSchema";
import {UserAuthenticator} from "../intelligentSuite/users/auth/Authenticate";
import {SentryInit} from "../sentry/sentryInitialization";
import {ApiContext, buildServerOptionsGraphQL} from "./serverOptions";

export interface SubscriptionServerOnConnectParams {
    Authorization: string | undefined;
    authorization: string | undefined;
    headers: Omit<SubscriptionServerOnConnectParams, "headers"> | undefined;
}

const main = async () => {
    SentryInit();

    // Db and dependencies initialization
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_db, schema, _dynamo, _mongo, _cache] = await Promise.all([
        createDB(),
        graphqlSchema(Config.local, true),
        createDynamoDB(),
        MongoDbConnection.connect(),
        createCacheClient(),
    ]);

    // GraphQL initialization
    const serverOptions = await buildServerOptionsGraphQL(schema);
    const server = new ApolloServer(serverOptions);

    // Express initialization
    const app = Express();

    // Middlewares
    app.use(SentryInit().Handlers.requestHandler());
    app.use(Express.json());
    // app.use(graphqlUploadExpress({maxFileSize: 100_000_000, maxFiles: 10}));
    app.use(
        helmet({
            hsts: {
                maxAge: 31536000, // 1 year
                includeSubDomains: true,
            },
        }),
    );

    app.get("/", (_req: Request, res: Response) => {
        res.send("Memorable");
    });

    // Error handlers
    app.use(
        SentryInit().Handlers.errorHandler({
            shouldHandleError(error) {
                return Boolean(error.status && Number(error.status) >= 400);
            },
        }),
    );

    const httpServer = createServer(app);

    // Web sockets server
    SubscriptionServer.create(
        {
            schema: serverOptions.schema,
            keepAlive: 1000,
            execute,
            subscribe,
            async onConnect(
                connectionParams: SubscriptionServerOnConnectParams,
                _websocket: WebSocket,
                context: ApiContext,
            ) {
                context.headers = {
                    Authorization:
                        connectionParams.Authorization ??
                        connectionParams.authorization ??
                        connectionParams.headers?.authorization ??
                        connectionParams.headers?.Authorization,
                };

                const user = await new UserAuthenticator().authenticate(context);

                console.log(`User with id: ${user.id} has connected`);

                return {
                    headers: context.headers,
                    user,
                };
            },
            onDisconnect() {
                console.log("Websocket server disconnected!");
            },
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        },
    );

    // Start server
    await server.start();

    server.applyMiddleware({app});

    const port = process.env.PORT || 3333;

    httpServer.listen({port}, () => {
        console.log(`GraphQL server ready and listening at ==> http://localhost:${port}${server.graphqlPath}`);
        console.log(`API server ready and listening at ==> http://localhost:${port}/api`);
    });
};

main().catch((error) => {
    console.log(error, "error");
});
