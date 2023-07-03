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
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    migrationsRun: false,
    migrations: [],
};
const creativeDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `NO_URL`,
};
const integrationDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `NO_URL`,
};

const userDbOptions: UrlDbConnection = {
    options: "socket_timeout=30&connection_limit=20&pool_timeout=20",
    url: `NO_URL`,
};
const awsConfig: AWSConfig = {
    accessKeyId: "access key",
    secretAccessKey: "secret key",
    region: "region",
};

const s3Config: S3Config = {
    bucket: "bucket",
    manuallyScrapedAssetsBucket: "manually-scraped-assets",
    brandLogoPath: "brand/",
    assetInputPath: "asset-input/",
    assetUrlPath: "asset-url/",
    requestedContextsUrlPath: "requestedContexts/",
    creativesBucket: "creatives-bucket",
};

const slackConfig: SlackConfig = {
    webhooksUrl: "test",
};

const mailingConfig: MailingConfig = {
    mailchimpApiKey: "api key",
};

const lambdasConfig: LambdasConfig = {
    boundingBoxSaliencyUrl: "https://boundingbox.saliency.url.com",
    baiRecalculation: "https://bai.recalculation.url.com",
    conversionMetricsCalculation: "https://conversion.calculation.url.com",
    conversionMetricsCalculationStepFunctions: "conversion_arn",
    inferencePipelineArn: "arn:inference",
    manualScraperArn: "arn:manualscraper",
    creativesHandlerUrl: "creatives_handler_url",
    performancePipelineUrl: "performance_pipeline_url",
};

const lambdasKeys: LambdasKeys = {
    creativesHandlerApiKey: "api key",
};

const pipelineConfig: PipelineConfig = {
    apiKey: "api key",
};

const dynamoDb: DynamoDbConfig = {
    frameWise: "framewise",
    conversion: "conversion",
    config: "configuration-test",
};

const mongoUri = "tests";

const scraperQueueConfig: ScraperQueueConfig = {
    url: "url",
    messageGroupId: "messagegroupid",
};

const integrationsConfig: IntegrationsConfig = {
    url: "url",
    apiKey: "key",
    facebookApp: {
        appId: "id",
        appSecret: "secret",
        redirectUri: "uri",
    },
    targetEnvironment: "test",
};
const insightPipelineConfig: InsightPipelineConfig = {
    url: "",
};

class ConfigTests implements IConfig {
    local = false;
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
    lambdas = lambdasConfig;
    lambdasKeys = lambdasKeys;
    pipeline = pipelineConfig;
    dynamoDb = dynamoDb;
    jwtSecret = "";
    url = "test";
    sentryDSN = "";
    scraperQueue = scraperQueueConfig;
    integrations = integrationsConfig;
    insight = insightPipelineConfig;
    cacheUrl = null;
    subscriptionUrl = "redis url";
    encryptionSecretKey = "test";
}

const config = new ConfigTests();
export {config as ConfigTests};
