import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";

export class BusinessAccountQuerySet<T extends SoftDeleteEntity> extends QuerySet<T> {}
