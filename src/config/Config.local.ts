import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";
import {
    AWSConfig,
    DynamoDbConfig,
    IConfig,
    InsightPipelineConfig,
    IntegrationsConfig,
    LambdasConfig,
    LambdasKeys,
    MailingConfig,
    PipelineConfig,
    S3Config,
    ScraperQueueConfig,
    SlackConfig,
    UrlDbConnection,
} from "./IConfig";

const dbConnectionOptions: ConnectionOptions = {
    type: "mysql",
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "") ?? 3307,
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_NAME ?? "test_db",
};
const creativeDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `mysql://root:root@localhost:3307/creative_schema`,
};
const integrationDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `mysql://root:root@localhost:3307/integration_schema`,
};

const userDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `mysql://root:root@localhost:3307/test_schema`,
};

const awsConfig: AWSConfig = {
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
};

const s3Config: S3Config = {
    bucket: "tekal-dashboard-asset-input",
    manuallyScrapedAssetsBucket: "manually-scraped-assets",
    brandLogoPath: "dev/logos/brand_",
    assetInputPath: "dev/input/",
    assetUrlPath: "dev/original/",
    requestedContextsUrlPath: "dev/requestedContexts/",
    creativesBucket: "local-bucket",
};

const slackConfig: SlackConfig = {
    webhooksUrl: "",
};

const mailingConfig: MailingConfig = {
    mailchimpApiKey: "",
};

const lambdasConfig: LambdasConfig = {
    boundingBoxSaliencyUrl: "url.com",
    baiRecalculation: "url.com",
    conversionMetricsCalculation: "url.com",
    conversionMetricsCalculationStepFunctions: "url.com",
    inferencePipelineArn: "",
    manualScraperArn: "arn:manualscraper",
    creativesHandlerUrl: "",
    performancePipelineUrl: "",
};

const lambdasKeys: LambdasKeys = {
    creativesHandlerApiKey: "",
};

const pipelineConfig: PipelineConfig = {
    apiKey: "key",
};

const dynamoDb: DynamoDbConfig = {
    frameWise: "DEV-asset-framewise",
    conversion: "DEV-conversion",
    config: "dashboard_configuration",
};

const api = "http://localhost:3333/api";

const SentryDSN = "";

const mongoUri = process.env.MONGO_DB ?? "mongodb://root:root@127.0.0.1:27017/dashboard?authSource=admin";

const scraperQueueConfig: ScraperQueueConfig = {
    url: "url",
    messageGroupId: "scraping_job_requests",
};

const integrationsConfig: IntegrationsConfig = {
    url: "http://facebook-ads-manager-integrations.eba-qcgghpa3.us-east-1.elasticbeanstalk.com",
    apiKey: "",
    facebookApp: {
        appId: "",
        appSecret: "",
        redirectUri: "",
    },
    targetEnvironment: "dev",
};
const insightPipelineConfig: InsightPipelineConfig = {
    url: "",
};

class ConfigLocal implements IConfig {
    local = true;
    production = false;
    db = {
        sql: dbConnectionOptions,
        creativeDb: creativeDbOptions,
        integrationDb: integrationDbOptions,
        userDb: userDbOptions,
        sqlMigrations: dbConnectionOptions,
        mongo: mongoUri,
    };
    aws = awsConfig;
    s3 = s3Config;
    mailing = mailingConfig;
    slack = slackConfig;
    lambdasKeys = lambdasKeys;
    lambdas = lambdasConfig;
    pipeline = pipelineConfig;
    dynamoDb = dynamoDb;
    jwtSecret = "1234";
    url = api;
    sentryDSN = SentryDSN;
    scraperQueue = scraperQueueConfig;
    integrations = integrationsConfig;
    insight = insightPipelineConfig;
    cacheUrl = process.env.CACHE_URL ?? null;
    subscriptionUrl = process.env.CACHE_URL || "localhost:6379";
    encryptionSecretKey = "test";
}

const config = new ConfigLocal();
export {config as ConfigLocal};

export const MOCK_S3_FILE = "dev/logos/test";
