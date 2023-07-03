import {Field, ObjectType} from "type-graphql/dist/decorators";
import {Float} from "type-graphql/dist/scalars";
import {Metric} from "./Metrics";

export enum LabeledMetricValue {
    unknown = "unknown",
    low = "low",
    mid = "mid",
    high = "high",
}

export enum CreativeMetric {
    adRecallRate = "adRecallRate",
    bai = "bai",
    fiveSecondsIndex = "fiveSecondsIndex",
    textSaliencyScore = "textSaliencyScore",
    logoSaliencyScore = "logoSaliencyScore",
}

@ObjectType()
export class CreativeMetricValue {
    @Field(() => Float, {nullable: true})
    value?: number;
    @Field(() => LabeledMetricValue, {defaultValue: LabeledMetricValue.unknown})
    labeledValue = LabeledMetricValue.unknown;

    static createCreativeMetricValue(value: number, quantiles: number[]) {
        const newCreativeMetricValue = new CreativeMetricValue();
        newCreativeMetricValue.value = value;
        newCreativeMetricValue.labeledValue = CreativeMetricValue.createLabeledValue(value, quantiles);
        return newCreativeMetricValue;
    }

    static createLabeledValue(value: number, quantiles: number[]) {
        if (value < quantiles[0]) {
            return LabeledMetricValue.low;
        } else if (value < quantiles[1]) {
            return LabeledMetricValue.mid;
        }
        return LabeledMetricValue.high;
    }
}

@ObjectType()
export class CreativeMetrics {
    @Field(() => CreativeMetricValue, {nullable: true})
    [Metric.adRecallRate]?: CreativeMetricValue;
    @Field(() => CreativeMetricValue, {nullable: true})
    [Metric.bai]?: CreativeMetricValue;
    @Field(() => CreativeMetricValue, {nullable: true})
    [Metric.fiveSecondsIndex]?: CreativeMetricValue;
    @Field(() => CreativeMetricValue, {nullable: true})
    [Metric.textSaliencyScore]?: CreativeMetricValue;
    @Field(() => CreativeMetricValue, {nullable: true})
    [Metric.logoSaliencyScore]?: CreativeMetricValue;
}
