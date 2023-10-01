import {Column, Entity, OneToMany} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import Brand from "./Brand";
import {BaseEntity} from "../../../common/entities/BaseEntity";
import {BrandStatusInput} from "../input/BrandInput";

@ObjectType()
@Entity()
export default class BrandStatus extends BaseEntity {

    @Column()
    @Field()
    status!: ValidBrandStatus

    @OneToMany(() => Brand, (brand) => brand.status, {eager: true})
    @Field(() => [Brand])
    brand!: Brand;

    static create(brand: Brand, input: BrandStatusInput) {
        const brandStatus = new BrandStatus()
        brandStatus.setId();
        brandStatus.status = input.status
        brandStatus.brand = brand

        return brandStatus
    }
}
export enum ValidBrandStatus {
    IN_PROGRESS = "IN_PROGRESS",
    DATA_READY = "DATA_READY",
    MODEL_TRAINING = "MODEL_TRAINING",
    READY = "READY",
}