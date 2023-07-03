import {AnyObject} from "mongoose";
import {MongoQuery} from "./MongoPipeline";

export class MongoPush implements MongoQuery {
    private pushes: AnyObject = {};

    push(field: string, value: string): this {
        this.pushes[field] = value;
        return this;
    }

    getQuery(): AnyObject {
        return {$push: this.pushes};
    }
}
