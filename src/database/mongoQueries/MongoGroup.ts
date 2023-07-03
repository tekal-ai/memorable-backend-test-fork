import {AnyObject, PipelineStage} from "mongoose";
import {MongoPipelineStage, MongoQuery} from "./MongoPipeline";

export class MongoGroup implements MongoPipelineStage {
    private id: AnyObject = {};
    private fields: AnyObject = {};

    groupBy(field: string, value: string): this {
        this.id[field] = value;
        return this;
    }

    addField(field: string, value: MongoQuery): this {
        this.fields[field] = value.getQuery();
        return this;
    }

    addCustomField(field: string, value: AnyObject): this {
        this.fields[field] = value;
        return this;
    }

    addData(field: string, value: string): this {
        this.fields[field] = {$first: value};
        return this;
    }

    getStage(): PipelineStage.Group {
        return {
            $group: {
                _id: this.id,
                ...this.fields,
            },
        };
    }
}
