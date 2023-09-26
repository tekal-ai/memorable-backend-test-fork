import {BaseEntity, Column, Entity, OneToMany} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import Brand from "./Brand";

export enum ValidBrandStatus {
    IN_PROGRESS = "IN_PROGRESS",
    DATA_READY = "DATA_READY",
    MODEL_TRAINING = "MODEL_TRAINING",
    READY = "READY",
}
@ObjectType()
@Entity()
export default class BrandStatus extends BaseEntity {

    @Column()
    @Field()
    status! : ValidBrandStatus

    @OneToMany(() => Brand, (brand) => brand.brandStatus, {eager: true})
    @Field(() => [Brand])
    brand!: Brand;

    @Column()
    @Field()
    createdDate! : Date


}