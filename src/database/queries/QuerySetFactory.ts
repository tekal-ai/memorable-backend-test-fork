import {getRepository} from "typeorm";
import {EntityTarget} from "typeorm/common/EntityTarget";
import {BaseEntity} from "../../common/entities/BaseEntity";
import {IQuerySetClass, QuerySet} from "../../common/repositories/QuerySet";
import Brand from "../../intelligentSuite/brands/entities/Brand";
import {BrandQuerySet} from "../../intelligentSuite/brands/repository/BrandQuerySet";

/*
Useful when you need a query set outside the repository context (sub queries for example)
*/
export class QuerySetFactory {
    createBrandQuerySet(alias: string): BrandQuerySet<Brand> {
        return this.createQuerySet(BrandQuerySet, Brand, alias);
    }

    private createQuerySet<TEntity extends BaseEntity, TQuerySet extends QuerySet<TEntity>>(
        querySet: IQuerySetClass<TEntity, TQuerySet>,
        entityClass: EntityTarget<TEntity>,
        alias: string,
    ): TQuerySet {
        return new querySet(getRepository(entityClass).createQueryBuilder(alias), alias);
    }
}
