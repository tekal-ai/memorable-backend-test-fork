import {Type} from "class-transformer";
import {Field, ObjectType} from "type-graphql";
import {Column, Entity, ManyToOne} from "typeorm";
import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {NotFoundError} from "../../../common/errors/NotFoundError";
import Brand from "../../brands/entities/Brand";
import {BusinessAccount} from "../../businessAccounts/entities/BusinessAccount";
import {PasswordGenerator} from "../auth/PasswordGenerator";
import {PasswordHash} from "../auth/PasswordHash";
import {UserInfo, UserProfileInput} from "../input/UserInput";

@Entity()
@ObjectType()
export class User extends SoftDeleteEntity {
    @Field()
    @Column({unique: true})
    email!: string;

    @Column({nullable: true})
    password?: string;

    @Field({nullable: true})
    @Column({nullable: true})
    name?: string;

    @Field()
    @Column({default: false})
    isAdmin!: boolean;

    @Field(() => BusinessAccount, {nullable: true})
    @ManyToOne(() => BusinessAccount, {nullable: true, eager: true})
    @Type(() => BusinessAccount)
    businessAccount?: BusinessAccount;

    @Field({nullable: true})
    @Column({nullable: true})
    termsAndConditionsAccepted?: Date;

    @Column({nullable: true})
    emailCode?: string;

    @Field()
    @Column({default: false})
    emailVerified!: boolean;

    @Field()
    @Column({default: true})
    isContractValid!: boolean;

    @Column({nullable: true})
    lastLogin?: Date;

    static createUser(input: UserInfo): User {
        const newUser = new User();
        newUser.setId();
        newUser.name = input.name;
        newUser.email = input.email;
        newUser.businessAccount = input.businessAccount;
        newUser.password = new PasswordHash().hash(new PasswordGenerator().generate(input.password));
        newUser.isAdmin = input.isAdmin ?? false;
        return newUser;
    }

    verifyEmail(user: User) {
        user.emailVerified = true;
        user.emailCode = undefined;
    }

    public verifyPassword(password?: string): boolean {
        if (!password || !this.password) {
            return false;
        }
        return new PasswordHash().verify(password, this.password);
    }

    updateProfile(input: UserProfileInput) {
        this.name = input.name || this.name;

        if (input.newPassword && this.verifyPassword(input.currentPassword)) {
            this.password = new PasswordHash().hash(input.newPassword);
        }
    }

    acceptTermsAndConditions() {
        this.termsAndConditionsAccepted = new Date();
    }
    getBusinessAccount(): BusinessAccount {
        if (!this.businessAccount) {
            throw new NotFoundError(ErrorMsg.USER_NOT_HAVE_BUSINESS_ACCOUNT);
        }
        return this.businessAccount;
    }
    getBrand(brandId: string): Brand {
        const businessAccount = this.getBusinessAccount();
        const brands = businessAccount.brands;
        if (!brands) {
            throw new NotFoundError(ErrorMsg.USER_NOT_HAVE_BRANDS);
        }
        const brand = brands.find((brand) => {
            return brand.id == brandId;
        });
        if (!brand) {
            throw new NotFoundError(ErrorMsg.USER_NOT_HAVE_ACCESS_TO_BRAND);
        }
        return brand;
    }
    getSocialAccounts(brandId: string): string[] {
        const brand = this.getBrand(brandId);
        return !brand.socialAccounts ? [] : brand.socialAccounts;
    }
}
