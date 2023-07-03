import {plainToInstance} from "class-transformer";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {ObjectLiteral} from "typeorm/common/ObjectLiteral";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";
import {GetIdsAndPositionSubQuery} from "../../database/queries/GetIdsAndPositionSubQuery";
import {InQuery} from "../../database/queries/InQuery";
import {BaseEntity} from "../entities/BaseEntity";
import {PaginationInput} from "../pagination/PaginationInput";
import {SortType} from "../queries/Sort";

export interface IQuerySetClass<T extends BaseEntity, Q extends QuerySet<T>> {
    new (queryBuilder: SelectQueryBuilder<T>, entityName: string): Q;
}

export type ISubQuerySet = {
    query: string;
    parameters: ObjectLiteral;
};

export class QuerySet<T extends BaseEntity> {
    protected queryBuilder: SelectQueryBuilder<T>;
    protected entityName: string;

    protected joinedQuerySets: {[key: string]: QuerySet<T>} = {};
    protected selectedRelations: string[] = [];
    protected rawSelect = false;

    constructor(queryBuilder: SelectQueryBuilder<T>, entityName: string) {
        this.queryBuilder = queryBuilder;
        this.entityName = entityName;
    }

    filterById(entityId: string | undefined): this {
        this.queryBuilder = this.queryBuilder.andWhere(`${this.entityName}.id = :${this.entityName}Id`, {
            [`${this.entityName}Id`]: entityId || "invalid",
        });
        return this;
    }

    filterByIds(entityIds: string[]): this {
        if (entityIds.length === 1) {
            return this.filterById(entityIds[0]);
        }

        const query = new InQuery(this.entityName, "id", entityIds, "Ids").getQueryAndParameters();
        this.queryBuilder = this.queryBuilder.andWhere(query.query, query.parameters);

        return this;
    }

    filterByInstances(entities: T[]): this {
        return this.filterByIds(entities.map((entity) => entity.id));
    }

    /*
     *  Filter by ids using a sub query. Useful when using limit offset pagination when the sub query has joins.
     */
    filterByIdInSubQuery<Q extends BaseEntity>(subQuery: QuerySet<Q>, limit: number, pageNumber: number): this {
        const idsSubQuery = subQuery.clearSelect().selectField("id");
        const offset = pageNumber * limit;
        const subQuerySelect = new GetIdsAndPositionSubQuery().getQuery(this.entityName, idsSubQuery, limit, offset);
        this.queryBuilder = this.queryBuilder
            .innerJoin(
                `(${subQuerySelect})`,
                `${this.entityName}SubQuery`,
                `${this.entityName}.id = ${this.entityName}SubQuery.id`,
            )
            .setParameters(idsSubQuery.getSubQuery().parameters)
            .orderBy(`${this.entityName}SubQuery.position`);
        return this;
    }

    groupById(): this {
        return this.groupByField("id");
    }

    groupByField(field: string): this {
        this.queryBuilder = this.queryBuilder.addGroupBy(`${this.entityName}.${field}`);
        this.rawSelect = true;
        return this;
    }

    orderById(sort: SortType): this {
        return this.orderBy("id", sort);
    }

    orderBy(field: string, sort: SortType): this {
        return this.orderBySelectedField(`${this.entityName}.${field}`, sort);
    }

    orderBySelectedField(field: string, sort: SortType): this {
        this.queryBuilder = this.queryBuilder.addOrderBy(`${field}`, sort);
        return this;
    }

    limit(count: number): this {
        this.queryBuilder = this.queryBuilder.limit(count);
        return this;
    }

    offset(offset: number): this {
        this.queryBuilder = this.queryBuilder.offset(offset);
        return this;
    }

    paginate(pagination: PaginationInput, sort = SortType.ASC): this {
        const operation = sort === SortType.ASC ? ">" : "<";
        this.queryBuilder = this.queryBuilder.limit(pagination.count);

        if (pagination.lastRetrievedId) {
            this.queryBuilder = this.queryBuilder.andWhere(
                `${this.entityName}.id ${operation} :${this.entityName}AfterId`,
                {
                    [`${this.entityName}AfterId`]: pagination.lastRetrievedId,
                },
            );
        }

        return this;
    }

    paginateLimitOffset(limit: number, pageNumber: number): this {
        const offset = pageNumber * limit;
        return this.limit(limit).offset(offset);
    }

    selectField(field: string, alias?: string): this {
        const selectedField = `${this.entityName}.${field}`;
        const selectedAlias = alias || field;
        this.queryBuilder = this.queryBuilder.addSelect(selectedField, selectedAlias);
        return this;
    }

    selectRelationField(relationAlias: string, field: string, alias?: string): this {
        const selectedField = `${relationAlias}.${field}`;
        const selectedAlias = alias || field;
        this.queryBuilder = this.queryBuilder.addSelect(selectedField, selectedAlias);
        return this;
    }

    select(select: string, alias: string): this {
        this.queryBuilder = this.queryBuilder.addSelect(select, alias);
        return this;
    }

    clearSelect(): this {
        this.queryBuilder = this.queryBuilder.select([]);
        return this;
    }

    selectCount(alias?: string): this {
        this.queryBuilder = this.queryBuilder.addSelect(
            `COUNT(DISTINCT(${this.entityName}.id))`,
            alias || `${this.entityName}Count`,
        );
        return this;
    }

    async count(): Promise<number> {
        return this.queryBuilder.getCount();
    }

    selectAverage(field: string, alias = "average"): this {
        this.queryBuilder = this.queryBuilder.select(`AVG(${this.entityName}.${field})`, alias);
        return this;
    }

    async average(field: string): Promise<number> {
        this.selectAverage(field);

        const avg = await this.queryBuilder.getRawOne();
        return avg.average || 0;
    }

    whereName(search: string): this {
        this.queryBuilder = this.queryBuilder.andWhere(`${this.entityName}.name = :${this.entityName}SearchedName`, {
            [`${this.entityName}SearchedName`]: `${search}`,
        });
        return this;
    }

    whereNameIn(search: string[]): this {
        const query = new InQuery(this.entityName, "name", search, "SearchedNames").getQueryAndParameters();
        this.queryBuilder = this.queryBuilder.andWhere(query.query, query.parameters);
        return this;
    }

    searchName(search: string): this {
        return this.searchString(search, "name");
    }

    searchString(search: string, field: string): this {
        this.queryBuilder = this.queryBuilder.andWhere(
            `${this.entityName}.${field} LIKE :${this.entityName}Searched${field}`,
            {
                [`${this.entityName}Searched${field}`]: `%${search}%`,
            },
        );
        return this;
    }

    forDateRange(startDate?: Date, endDate?: Date, field = "createdAt"): this {
        if (startDate) {
            this.queryBuilder = this.queryBuilder.andWhere(
                `DATE(${this.entityName}.${field}) >= DATE(:${this.entityName}DateFieldStartDate)`,
                {
                    [`${this.entityName}DateFieldStartDate`]: startDate.toISOString(),
                },
            );
        }
        if (endDate) {
            this.queryBuilder = this.queryBuilder.andWhere(
                `DATE(${this.entityName}.${field}) <= DATE(:${this.entityName}DateFieldEndDate)`,
                {
                    [`${this.entityName}DateFieldEndDate`]: endDate.toISOString(),
                },
            );
        }
        return this;
    }

    whereField(field: string, value: string | number): this {
        this.queryBuilder = this.queryBuilder.andWhere(`${this.entityName}.${field} = :${this.entityName}${field}`, {
            [`${this.entityName}${field}`]: value,
        });
        return this;
    }

    whereFieldIn(field: string, search: string[]): this {
        const query = new InQuery(this.entityName, field, search, "SearchedFieldValues").getQueryAndParameters();
        this.queryBuilder = this.queryBuilder.andWhere(query.query, query.parameters);
        return this;
    }

    getQueryBuilder(): SelectQueryBuilder<T> {
        return this.queryBuilder;
    }

    getQuery(): string {
        return this.queryBuilder.getQuery();
    }

    getSubQuery(): ISubQuerySet {
        return {
            query: this.getQuery(),
            parameters: this.queryBuilder.getParameters(),
        };
    }

    async getMany(): Promise<T[]> {
        let result;
        if (this.rawSelect) {
            const {entities, raw} = await this.queryBuilder.getRawAndEntities();
            result = entities.map((entity, index) => {
                const keys = Object.keys(raw[index]);
                for (const key of keys) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (entity[key] === undefined) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        entity[key] = raw[index][key] !== undefined ? raw[index][key] : entity[key];
                    }
                }
                return entity;
            });
        } else {
            result = await this.queryBuilder.getMany();
        }
        return await Promise.all(result.map((entity) => this.modifyResult(entity)));
    }

    async getRawMany<Q>(resultClass: ClassConstructor<Q>): Promise<Q[]> {
        const results = await this.queryBuilder.getRawMany();
        return plainToInstance(resultClass, results, {enableImplicitConversion: true});
    }

    async getIds(): Promise<string[]> {
        this.clearSelect().selectField("id", "id");
        const results = await this.queryBuilder.getRawMany();
        return results.map((item) => item.id);
    }

    async getOne(): Promise<T | undefined> {
        const entity = await this.queryBuilder.getOne();
        return entity ? this.modifyResult(entity) : undefined;
    }

    async getRawOne<Q>(resultClass: ClassConstructor<Q>): Promise<Q> {
        const result = await this.queryBuilder.getRawOne();
        return plainToInstance(resultClass, result, {enableImplicitConversion: true});
    }

    async update(values: QueryDeepPartialEntity<T>): Promise<void> {
        await this.queryBuilder.update().set(values).execute();
    }

    eagerRelations(): this {
        return this;
    }

    protected async modifyResult(entity: T): Promise<T> {
        return entity;
    }

    leftJoin(entity: string, condition?: string): this {
        this.queryBuilder = this.queryBuilder.leftJoin(entity, this.entityName, condition);
        return this;
    }

    innerJoin(entity: string, condition?: string): this {
        this.queryBuilder = this.queryBuilder.innerJoin(entity, this.entityName, condition);
        return this;
    }

    innerJoinSubQuery<Q extends BaseEntity>(query: QuerySet<Q>, condition?: string): this {
        const subQ = query.getSubQuery();
        this.queryBuilder = this.queryBuilder
            .innerJoin(`(${subQ.query})`, `${this.entityName}Subquery`, condition)
            .setParameters(subQ.parameters);
        return this;
    }

    selectRelation(entity: string): this {
        if (!this.selectedRelations.includes(entity)) {
            this.queryBuilder = this.queryBuilder.addSelect(entity);
            this.selectedRelations.push(entity);
        }
        return this;
    }

    leftJoinRelation<Q extends QuerySet<T>>(
        querySet: IQuerySetClass<T, Q>,
        alias: string,
        entity: string,
        selectRelation = false,
        condition?: string,
    ): Q {
        return this.joinRelation(querySet, alias, entity, selectRelation, condition, false);
    }

    innerJoinRelation<Q extends QuerySet<T>>(
        querySet: IQuerySetClass<T, Q>,
        alias: string,
        entity: string,
        selectRelation = false,
        condition?: string,
    ): Q {
        return this.joinRelation(querySet, alias, entity, selectRelation, condition, true);
    }

    private joinRelation<Q extends QuerySet<T>>(
        querySet: IQuerySetClass<T, Q>,
        alias: string,
        entity: string,
        selectRelation: boolean,
        condition?: string,
        inner = false,
    ): Q {
        if (selectRelation) {
            this.selectRelation(alias);
        }

        if (this.joinedQuerySets[alias] !== undefined) {
            const relation = this.joinedQuerySets[alias];
            relation.queryBuilder = this.queryBuilder;
            return relation as Q;
        }

        const relation = new querySet(this.queryBuilder, alias);

        this.joinedQuerySets[alias] = relation;
        const name = `${this.entityName}.${entity}`;
        const result = inner ? relation.innerJoin(name, condition) : relation.leftJoin(name, condition);
        return result.eagerRelations();
    }
}
