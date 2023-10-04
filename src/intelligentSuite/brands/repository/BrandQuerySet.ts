import {BaseEntity} from "../../../common/entities/BaseEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";
import {UserQuerySet} from "../../users/repositories/UserQuerySet";
import {BrandStatusQuerySet} from "./BrandStatusQuerySet";

export class BrandQuerySet<T extends BaseEntity> extends QuerySet<T> {

    withBrandStatus(): this {
        this.queryBuilder = this.leftJoinRelation(BrandStatusQuerySet, "brandStatus", "brandStatus", true).getQueryBuilder();
        return this;
    }
}
