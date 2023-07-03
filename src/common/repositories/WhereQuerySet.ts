import {WhereExpressionBuilder} from "typeorm";

export class WhereQuerySet {
    protected queryBuilder: WhereExpressionBuilder;
    protected entityName: string;

    constructor(queryBuilder: WhereExpressionBuilder, entityName: string) {
        this.queryBuilder = queryBuilder;
        this.entityName = entityName;
    }

    filterByIds(entityIds: string[]): this {
        if (entityIds.length === 0) {
            entityIds.push("id");
        }
        this.queryBuilder = this.queryBuilder.orWhere(`${this.entityName}.id IN (:...${this.entityName}WhereQsIds)`, {
            [`${this.entityName}WhereQsIds`]: entityIds,
        });
        return this;
    }

    getQueryBuilder(): WhereExpressionBuilder {
        return this.queryBuilder;
    }
}
