import {AnyObject, PipelineStage} from "mongoose";

export interface MongoPipelineStage {
    getStage(): PipelineStage;
}

export interface MongoQuery {
    getQuery(): AnyObject;
}

export class MongoPipeline {
    private steps: PipelineStage[] = [];

    addStep(step: MongoPipelineStage): this {
        this.steps.push(step.getStage());
        return this;
    }

    addCustomStep(step: PipelineStage): this {
        this.steps.push(step);
        return this;
    }

    getPipeline(): PipelineStage[] {
        return this.steps;
    }
}
