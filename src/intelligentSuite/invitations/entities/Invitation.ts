import {Type} from "class-transformer";
import crypto from "crypto";
import {Field, ObjectType} from "type-graphql";
import {Column, Entity, Index, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {SoftDeleteEntity} from "../../../common/entities/SoftDeleteEntity";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {Config} from "../../../config/Config";
import {BusinessAccount} from "../../businessAccounts/entities/BusinessAccount";
import {User} from "../../users/entities/User";
import {InvitationInput} from "../input/InvitationInput";

export enum InvitationType {
    referral = "referral",
    internal = "internal",
}

@Entity()
@ObjectType()
export class Invitation extends SoftDeleteEntity {
    static readonly codeLength = 10;

    @Index()
    @Field()
    @Column()
    code!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    email?: string;

    @Field(() => InvitationType)
    @Column({default: InvitationType.referral})
    type!: InvitationType;

    @Field()
    @Column({default: false})
    isAdmin!: boolean;

    @ManyToOne(() => BusinessAccount, {nullable: true, eager: true})
    @Type(() => BusinessAccount)
    businessAccount?: BusinessAccount;

    @OneToOne(() => User, {nullable: true, eager: true})
    @JoinColumn()
    user?: User;

    @Field({nullable: true})
    @Column({type: Config.db.sql.type === "sqlite" ? "datetime" : "timestamp", nullable: true})
    expirationDate?: Date;

    static generateReferralInvitation(numInvitations = 1): Invitation[] {
        const invitationCode = Invitation.generateInvitationCode();
        const invitations = Array.from({length: numInvitations}, () => {
            return Invitation.createReferralInvitation(invitationCode);
        });
        return invitations;
    }

    static generateInternalInvitations(businessAccount: BusinessAccount, config: InvitationInput): Invitation[] {
        const invitationCode = Invitation.generateInvitationCode();
        const invitations = Array.from({length: config.numberOfInvitations}, () => {
            return Invitation.createInternalInvitation(businessAccount, invitationCode, config.isAdmin, config.email);
        });
        return invitations;
    }

    static createInternalInvitation(
        businessAccount: BusinessAccount,
        invitationCode: string,
        isAdmin: boolean,
        email?: string,
    ): Invitation {
        const newInvitation = new Invitation();
        newInvitation.setId();
        newInvitation.businessAccount = businessAccount;
        newInvitation.email = email;
        newInvitation.type = InvitationType.internal;
        newInvitation.isAdmin = isAdmin;
        newInvitation.code = invitationCode;
        return newInvitation;
    }

    private static createReferralInvitation(code: string): Invitation {
        const newInvitation = new Invitation();
        newInvitation.setId();
        newInvitation.type = InvitationType.referral;
        newInvitation.isAdmin = true;
        newInvitation.code = code;
        return newInvitation;
    }

    static generateInvitationCode() {
        const code = crypto.randomUUID().replace(/-/g, "").slice(0, Invitation.codeLength);
        return code;
    }

    assignUserToInvitation(user: User): Invitation {
        this.verifyInvitation(user.email);
        this.user = user;
        return this;
    }

    verifyInvitation(email?: string) {
        if (email) {
            this.validateEmail(email);
        }
        this.validateInvitation();
        this.validateNotUsed();
    }

    private validateEmail(email: string) {
        if (this.type === InvitationType.internal && this.email && this.email !== email) {
            throw new BadRequestError(ErrorMsg.INVITATION_EMAIL_MISMATCH);
        }
    }

    private validateInvitation() {
        if (this.expirationDate && this.expirationDate < new Date()) {
            throw new BadRequestError(ErrorMsg.INVITATION_CODE_EXPIRED);
        }
    }
    private validateNotUsed() {
        if (this.user) {
            throw new BadRequestError(ErrorMsg.INVITATION_CODE_ALREADY_USED);
        }
    }
}
