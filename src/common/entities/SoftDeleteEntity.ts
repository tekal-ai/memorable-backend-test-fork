import {ObjectType} from "type-graphql";
import {DeleteDateColumn} from "typeorm";
import {BaseEntity} from "./BaseEntity";

@ObjectType()
export abstract class SoftDeleteEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt?: Date;

    isDeleted(): boolean {
        return Boolean(this.deletedAt);
    }
}
