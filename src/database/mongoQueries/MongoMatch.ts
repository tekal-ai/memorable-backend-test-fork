import {AnyObject, FilterQuery, PipelineStage} from "mongoose";
import {MongoPipelineStage} from "./MongoPipeline";

export type MongoMatchValueType = string | number | Date | object;
export type MongoFilters = FilterQuery<any>;

export class MongoMatch implements MongoPipelineStage {
    private matches: AnyObject[] = [];

    equals(field: string, value: MongoMatchValueType): this {
        const match = {[field]: {$eq: value}};
        this.matches.push(match);
        return this;
    }

    greaterThanOrEqual(field: string, value: MongoMatchValueType): this {
        const match = {[field]: {$gte: value}};
        this.matches.push(match);
        return this;
    }

    lessThanOrEqual(field: string, value: MongoMatchValueType): this {
        const match = {[field]: {$lte: value}};
        this.matches.push(match);
        return this;
    }

    getStage(): PipelineStage.Match {
        return {$match: this.getFilters()};
    }

    getFilters(): MongoFilters {
        return {$and: this.matches};
    }
}
