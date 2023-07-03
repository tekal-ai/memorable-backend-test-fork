import {Field, Float, ObjectType} from "type-graphql";
import {CampaignObjective} from "./CampaignObjective";

@ObjectType()
export class MetricValue {
    @Field(() => Float)
    value = 0;
}

export enum Metric {
    impressions = "impressions",
    adRecallRate = "adRecallRate",
    reach = "reach",
    frequency = "frequency",
    brandLift = "brandLift",
    costPerMille = "costPerMille",
    engagement = "engagement",
    engagementRate = "engagementRate",
    costPerEngagement = "costPerEngagement",
    videoViews = "videoViews",
    videoThroughRate = "videoThroughRate",
    costPerCompletedView = "costPerCompletedView",
    clicks = "clicks",
    clickThroughRate = "clickThroughRate",
    costPerClick = "costPerClick",
    conversion = "conversion",
    conversionRate = "conversionRate",
    costPerAcquisition = "costPerAcquisition",
    costPerAppInstall = "costPerAppInstall",
    costPerLead = "costPerLead",
    leadRate = "leadRate",
    appInstallRate = "appInstallRate",
    usage = "usage",
    spend = "spend",
    bai = "bai",
    fiveSecondsIndex = "fiveSecondsIndex",
    textSaliencyScore = "textSaliencyScore",
    logoSaliencyScore = "logoSaliencyScore",
    leads = "leads",
    appInstall = "appInstall",
}

const ObjectiveToCostMetric = new Map<CampaignObjective, Metric>([
    [CampaignObjective.TRAFFIC, Metric.costPerClick],
    [CampaignObjective.AWARENESS, Metric.costPerMille],
    [CampaignObjective.CONVERSIONS, Metric.costPerAcquisition],
    [CampaignObjective.ENGAGEMENT, Metric.costPerEngagement],
    [CampaignObjective.LEAD_GENERATION, Metric.costPerLead],
    [CampaignObjective.VIDEO_VIEWS, Metric.costPerCompletedView],
    [CampaignObjective.APP_PROMOTION, Metric.costPerAppInstall],
]);

const ObjectiveToRatioMetric = new Map<CampaignObjective, Metric>([
    [CampaignObjective.TRAFFIC, Metric.clickThroughRate],
    [CampaignObjective.AWARENESS, Metric.frequency],
    [CampaignObjective.CONVERSIONS, Metric.conversionRate],
    [CampaignObjective.ENGAGEMENT, Metric.engagementRate],
    [CampaignObjective.LEAD_GENERATION, Metric.leadRate],
    [CampaignObjective.VIDEO_VIEWS, Metric.videoThroughRate],
    [CampaignObjective.APP_PROMOTION, Metric.appInstallRate],
]);

// const ObjectiveToMetric = new Map<CampaignObjective, Metric>([
//     [CampaignObjective.TRAFFIC, Metric.clicks],
//     [CampaignObjective.AWARENESS, Metric.reach],
//     [CampaignObjective.CONVERSIONS, Metric.conversion],
//     [CampaignObjective.ENGAGEMENT, Metric.engagement],
//     [CampaignObjective.LEAD_GENERATION, Metric.leads],
//     [CampaignObjective.VIDEO_VIEWS, Metric.videoViews],
//     [CampaignObjective.APP_PROMOTION, Metric.appInstall],
// ]);

@ObjectType()
export class MetricVariance {
    @Field(() => Metric)
    metric!: Metric;
    @Field({nullable: true})
    variance?: number;
    @Field({nullable: true})
    value?: number;
    @Field({nullable: true})
    average?: number;
    static getGenericVariance(metric: Metric, value: number, variance: number): MetricVariance {
        return {
            metric: metric || Metric.clickThroughRate,
            variance: variance,
            value: value,
        };
    }
    static getRatioVariance(
        campaign: CampaignObjective,
        variance: number,
        value: number,
        average?: number,
    ): MetricVariance {
        return {
            metric: ObjectiveToRatioMetric.get(campaign) || Metric.clickThroughRate,
            variance: variance,
            value: value,
            average: average,
        };
    }

    static getCostVariance(
        campaign: CampaignObjective,
        variance: number,
        value: number,
        average?: number,
    ): MetricVariance {
        return {
            metric: ObjectiveToCostMetric.get(campaign) || Metric.costPerClick,
            variance: variance,
            value: value,
            average: average,
        };
    }
}

@ObjectType()
export class Metrics {
    @Field(() => MetricValue, {nullable: true})
    [Metric.spend]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.usage]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.impressions]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.adRecallRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.reach]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.bai]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.engagement]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.engagementRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerEngagement]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.videoViews]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.videoThroughRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerCompletedView]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.clicks]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.clickThroughRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerClick]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.frequency]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerMille]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.conversion]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.conversionRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerAcquisition]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.leads]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.leadRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerLead]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.appInstall]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.appInstallRate]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.costPerAppInstall]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.fiveSecondsIndex]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.textSaliencyScore]?: MetricValue;
    @Field(() => MetricValue, {nullable: true})
    [Metric.logoSaliencyScore]?: MetricValue;
}
