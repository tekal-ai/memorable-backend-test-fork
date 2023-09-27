import {BaseEntity} from "../../../common/entities/BaseEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";

export class BrandStatusQuerySet<T extends BaseEntity> extends QuerySet<T> {}
