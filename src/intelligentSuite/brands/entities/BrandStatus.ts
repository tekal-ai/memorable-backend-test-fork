import {Field, ObjectType} from "type-graphql";
import {Column, Entity} from "typeorm";
import {BaseEntity} from "../../../common/entities/BaseEntity";
import {BrandStatusEnum} from "./BrandStatusEnum";

@ObjectType()
@Entity()
export default class BrandStatus extends BaseEntity {
    @Column()
    @Field()
    status!: BrandStatusEnum;
}
