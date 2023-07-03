import {Field, ObjectType} from "type-graphql";
import {Column, Entity, OneToMany} from "typeorm";
import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import Brand from "../../brands/entities/Brand";
import {User} from "../../users/entities/User";
import {CreateBusinessAccountInput, UpdateBusinessAccountInput} from "../input/BusinessAccountInput";

@Entity()
@ObjectType()
export class BusinessAccount extends SoftDeleteEntity {
    @Column()
    @Field()
    businessName!: string;

    @OneToMany(() => User, (user) => user.businessAccount)
    @Field(() => [User])
    users!: User[];

    @OneToMany(() => Brand, (brand) => brand.businessAccount, {eager: true, nullable: true})
    @Field(() => [Brand], {nullable: true})
    brands?: Brand[];

    @Column({nullable: true})
    @Field({nullable: true})
    businessLogoUrl?: string;

    @Column({nullable: true})
    @Field({nullable: true})
    businessPhone?: string;

    @Column({nullable: true})
    @Field({nullable: true})
    website?: string;

    @Column({nullable: true})
    @Field({nullable: true})
    address?: string;

    static create(input: CreateBusinessAccountInput) {
        const businessAccount = new BusinessAccount();
        businessAccount.setId();
        businessAccount.users = [];
        businessAccount.businessName = input.businessName;
        return businessAccount;
    }

    update(input: UpdateBusinessAccountInput) {
        this.businessName = input.businessName || this.businessName;
        this.address = input.address || this.address;
        this.businessPhone = input.businessPhone || this.businessPhone;
        this.website = input.website || this.website;
        this.businessLogoUrl = input.businessLogoUrl || this.businessLogoUrl;
    }
}
