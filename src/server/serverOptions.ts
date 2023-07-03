import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import {ApolloServerPlugin} from "apollo-server-plugin-base";
import express from "express";
import {GraphQLSchema} from "graphql";
import {sentryConfig} from "../sentry/sentryGraphqlConfig";

export const buildServerOptionsGraphQL = async (schema: GraphQLSchema) => {
    const plugins: ApolloServerPlugin[] = [sentryConfig];
    const isProd = process.env.PRODUCTION_MODE === "true" ?? false;

    if (!isProd) {
        plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
    }

    return {
        schema,
        plugins,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
        context: ({event, express, req}: {event: any; express: express.Express; req: express.Request}) => ({
            headers: event?.headers || req.headers,
        }),
        debug: !isProd,
        introspection: !isProd,
    };
};

export type ApiContext = {
    headers: {[key: string]: string | undefined};
};
