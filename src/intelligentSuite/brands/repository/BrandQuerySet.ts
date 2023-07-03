import {BaseEntity} from "../../../common/entities/BaseEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";

export class BrandQuerySet<T extends BaseEntity> extends QuerySet<T> {}
