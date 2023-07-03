import {AnyObject} from "mongoose";
import {MongoQuery} from "./MongoPipeline";

export class MongoSum implements MongoQuery {
    private field = "";

    constructor(field: string) {
        this.field = field;
    }

    getQuery(): AnyObject {
        return {$sum: this.field};
    }
}
