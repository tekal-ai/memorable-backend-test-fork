import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import {QuerySet} from "../../../common/repositories/QuerySet";
import {UserQuerySet} from "../../users/repositories/UserQuerySet";

export class InvitationQuerySet<T extends SoftDeleteEntity> extends QuerySet<T> {
    private get userAlias() {
        return `${this.entityName}User`;
    }

    withCode(code: string): this {
        this.queryBuilder = this.queryBuilder.andWhere(`${this.entityName}.code = :${this.entityName}code`, {
            [`${this.entityName}code`]: code,
        });
        return this;
    }

    withUser(): this {
        this.queryBuilder = this.leftJoinRelation(UserQuerySet, this.userAlias, "user", true).getQueryBuilder();
        return this;
    }

    public sortByAvailable(): this {
        this.queryBuilder = this.queryBuilder = this.queryBuilder
            .addOrderBy(`${this.entityName}.user`, "ASC")
            .addOrderBy(`${this.entityName}.expirationDate`, "DESC");
        return this;
    }
}
