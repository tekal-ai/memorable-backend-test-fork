import {getConnection} from "typeorm";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";
import {BaseEntity} from "../../common/entities/BaseEntity";

type SubQuery<T extends BaseEntity> = {
    queryBuilder: SelectQueryBuilder<T>;
    alias: string;
    joinFields: string[];
};

export class JoinedSubQueries {
    /*
    This method joins two sub queries with similar format into one query.
    Returns a query builder that can be used to select fields, order, etc.
     */
    static join<T extends BaseEntity>(query1: SubQuery<T>, query2: SubQuery<T>): SelectQueryBuilder<unknown> {
        if (query1.joinFields.length !== query2.joinFields.length) {
            throw new Error();
        }

        const joinCondition = query1.joinFields.map(
            (_field, index) =>
                `${query1.alias}.${query1.joinFields[index]} = ${query2.alias}.${query2.joinFields[index]}`,
        );
        return getConnection()
            .createQueryBuilder()
            .from(`(${query1.queryBuilder.getQuery()})`, query1.alias)
            .innerJoin(`(${query2.queryBuilder.getQuery()})`, query2.alias, joinCondition.join(" AND "))
            .setParameters(query1.queryBuilder.getParameters())
            .setParameters(query2.queryBuilder.getParameters());
    }
}
