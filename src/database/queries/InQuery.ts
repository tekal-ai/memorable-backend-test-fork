import {ISubQuerySet} from "../../common/repositories/QuerySet";

export class InQuery {
    private entity: string;
    private field: string;
    private values: string[];
    private alias: string;

    constructor(entity: string, field: string, values: string[], alias = "") {
        this.entity = entity;
        this.field = field;
        this.values = values;
        this.alias = alias;
    }

    getQueryAndParameters(): ISubQuerySet {
        return {
            query: `${this.entity}.${this.field} IN (:...${this.entity}${this.field}InQuery${this.alias})`,
            parameters: {[`${this.entity}${this.field}InQuery${this.alias}`]: this.values},
        };
    }
}
