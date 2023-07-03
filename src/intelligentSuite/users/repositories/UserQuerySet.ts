import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";

export class UserQuerySet<T extends SoftDeleteEntity> extends QuerySet<T> {
    withEmail(email: string): this {
        this.queryBuilder = this.queryBuilder.andWhere(`${this.entityName}.email = :${this.entityName}Email`, {
            [`${this.entityName}Email`]: email.toLowerCase(),
        });
        return this;
    }
}
