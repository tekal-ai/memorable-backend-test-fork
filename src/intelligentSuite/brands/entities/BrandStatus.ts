import {Column, Entity, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import Brand from "./Brand";
import {BaseEntity} from "../../../common/entities/BaseEntity";
import {BrandStatusInput} from "../input/BrandInput";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";

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
    status!: string

    static create(brand: Brand, input: BrandStatusInput) {
        const brandStatus = new BrandStatus()
        brandStatus.setId();
        brandStatus.status = input.status

        return brandStatus
    }

    isSameStatus(status: string){
        return this.status == status
    }
}