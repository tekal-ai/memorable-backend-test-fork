import {ulid} from "ulid";
import {BaseEntity} from "../../common/entities/BaseEntity";
import {ISubQuerySet, QuerySet} from "../../common/repositories/QuerySet";
import {Config} from "../../config/Config";

export class GetIdsAndPositionSubQuery {
    private readonly queryId: string;

    constructor() {
        this.queryId = ulid();
    }

    /*
     * Return a sub query that takes into account the order of the results for the main query and removes duplicated
     * The sub query should have selected `id` and `position`
     * The new sub query will return `id` and `position`
     */
    getQuery<Q extends BaseEntity>(
        entityName: string,
        subQuerySet: QuerySet<Q>,
        limit: number,
        offset: number,
    ): string {
        const positionQuery = this.getRowPositionQuery();
        const subQuery = this.modifySubQuery(subQuerySet);

        // SELECT id and position maintaining sub query order
        const subQueryWithPosition = `SELECT ${entityName}SubQueryWithPosition.id AS id, ${positionQuery} AS position 
                                      FROM (${subQuery.query}) AS ${entityName}SubQueryWithPosition`;

        // SELECT id and position removing duplicated and limiting results
        return `SELECT ${entityName}Derived.id AS id, min(${entityName}Derived.position) AS position from (${subQueryWithPosition}) AS ${entityName}Derived 
                                                                                     GROUP BY ${entityName}Derived.id 
                                                                                     ORDER BY min(${entityName}Derived.position) 
                                                                                     LIMIT ${limit} OFFSET ${offset}`;
    }

    private getRowPositionQuery(): string {
        return Config.db.sql.type === "sqlite"
            ? "row_number() over()"
            : `@rownum${this.queryId} := @rownum${this.queryId} + 1`;
    }

    private modifySubQuery<Q extends BaseEntity>(subQuerySet: QuerySet<Q>): ISubQuerySet {
        if (Config.db.sql.type === "mysql") {
            // Initialize @rownum with 0 for the query
            subQuerySet = subQuerySet.select(`@rownum${this.queryId} := 0`, `rownum${this.queryId}`);
        }
        return subQuerySet.getSubQuery();
    }
}
