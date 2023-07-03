import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";

interface IConfig {
    local: boolean;
    production: boolean;
    db: DbConfig;
    aws: AWSConfig;
    s3: S3Config;
    mailing: MailingConfig;
    slack: SlackConfig;
    lambdas: LambdasConfig;
    pipeline: PipelineConfig;
    dynamoDb: DynamoDbConfig;
    lambdasKeys: LambdasKeys;
    integrations: IntegrationsConfig;
    insight: InsightPipelineConfig;
    jwtSecret: string;
    url: string;
    sentryDSN: string;
    scraperQueue: ScraperQueueConfig;
    cacheUrl: string | null;
    subscriptionUrl: string;
    encryptionSecretKey: string;
}

export interface DbConfig {
    sql: ConnectionOptions;
    creativeDb: UrlDbConnection;
    integrationDb: UrlDbConnection;
    userDb: UrlDbConnection;
    sqlMigrations: ConnectionOptions;
    mongo: string | null;
}

export interface DynamoDbConfig {
    frameWise: string;
    conversion: string;
    config: string;
}

export interface AWSConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export interface S3Config {
    bucket: string;
    manuallyScrapedAssetsBucket: string;
    brandLogoPath: string;
    assetInputPath: string;
    assetUrlPath: string;
    requestedContextsUrlPath: string;
    creativesBucket: string;
}

export interface UrlDbConnection {
    options: string;
    url: string;
}

export interface SlackConfig {
    webhooksUrl: string;
}

export interface MailingConfig {
    mailchimpApiKey: string;
}

export interface LambdasConfig {
    boundingBoxSaliencyUrl: string;
    baiRecalculation: string;
    conversionMetricsCalculation: string;
    conversionMetricsCalculationStepFunctions: string;
    inferencePipelineArn: string;
    manualScraperArn: string;
    creativesHandlerUrl: string;
    performancePipelineUrl: string;
}

export interface LambdasKeys {
    creativesHandlerApiKey: string;
}

export interface PipelineConfig {
    apiKey: string;
}

export interface ScraperQueueConfig {
    url: string;
    messageGroupId: string;
}

export interface IntegrationsConfig {
    url: string;
    apiKey: string;
    facebookApp: {
        appId: string;
        appSecret: string;
        redirectUri: string;
    };
    targetEnvironment: string;
}

export interface InsightPipelineConfig {
    url: string;
}

export {IConfig};
