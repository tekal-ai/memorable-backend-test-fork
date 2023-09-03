import {Field, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "../../../common/entities/BaseEntity";
import {BusinessAccount} from "../../businessAccounts/entities/BusinessAccount";
import {Sector} from "../../common/entities/Sector";
import {CreateBrandInput, UpdateBrandInput} from "../input/BrandInput";
import {BrandStatus} from "./BrandStatus";

@ObjectType()
@Entity()
export default class Brand extends BaseEntity {
    @Column()
    @Field()
    name!: string;

    @Column({nullable: true})
    @Field({nullable: true})
    logoUrl?: string;

    @Field(() => BrandStatus, {nullable: true})
    @Column({type: "text", nullable: true})
    status?: BrandStatus;

    @Field(() => [Sector], {nullable: true})
    @Column({type: "simple-array", nullable: true})
    sector?: Sector[];

    @Field(() => [String], {nullable: true})
    @Column({type: "simple-array", nullable: true})
    adAccounts?: string[];

    @Field(() => [String], {nullable: true})
    @Column({type: "simple-array", nullable: true})
    socialAccounts?: string[];

    @ManyToOne(() => BusinessAccount)
    @Field(() => BusinessAccount)
    businessAccount!: BusinessAccount;

    static create(businessAccount: BusinessAccount, input: CreateBrandInput) {
        const brand = new Brand();
        brand.setId();
        brand.name = input.name;
        brand.sector = input.sector;
        brand.logoUrl = input.logoUrl || brand.logoUrl;
        brand.businessAccount = businessAccount;
        return brand;
    }

    update(input: UpdateBrandInput) {
        this.name = input.name || this.name;
        this.sector = input.sector || this.sector;
        this.logoUrl = input.logoUrl || this.logoUrl;
    }

    updateStatus(status: BrandStatus) {
        this.status = status;
    }
}

export type BrandInfo = {
    logoVariants?: boolean;
    colorPalletes?: boolean;
    topics?: boolean;
};
