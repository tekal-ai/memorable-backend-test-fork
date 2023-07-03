import {Service} from "typedi";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {BaseService} from "../../common/service/BaseService";
import {User} from "../../users/entities/User";
import {Invitation} from "../entities/Invitation";
import {InvitationInput} from "../input/InvitationInput";
import {InvitationRepository} from "../repositories/InvitationRepository";

@Service()
export class InvitationService extends BaseService {
    constructor(private readonly invitationRepository: InvitationRepository) {
        super();
    }

    async createReferralInvitations(user: User, numberOfInvitations: number): Promise<Invitation[]> {
        this.logger.debug(this.createInternalInvitation.name, `Creating ${numberOfInvitations} referral invitations`, {
            userId: user.email,
            numberOfInvitations,
        });
        if (!user.isAdmin && user.id !== "1") {
            throw new BadRequestError(ErrorMsg.NOT_ENOUGH_PERMISSIONS);
        }
        const invitations = Invitation.generateReferralInvitation(numberOfInvitations);
        await this.invitationRepository.saveMultiple(invitations);
        this.logger.info(this.createInternalInvitation.name, `Created ${numberOfInvitations} referral invitations`, {
            userId: user.email,
            numberOfInvitations,
            invitations,
        });
        return invitations;
    }
    async createInternalInvitation(user: User, config: InvitationInput): Promise<Invitation[]> {
        this.logger.debug(this.createInternalInvitation.name, `Creating internal invitation`, {
            userId: user.email,
            config,
        });
        if (!user.isAdmin) {
            throw new BadRequestError(ErrorMsg.NOT_ENOUGH_PERMISSIONS);
        }
        if (user.businessAccount === undefined) {
            throw new BadRequestError(ErrorMsg.USER_NOT_HAVE_BUSINESS_ACCOUNT);
        }
        const invitations = Invitation.generateInternalInvitations(user.getBusinessAccount(), config);
        await this.invitationRepository.saveMultiple(invitations);
        this.logger.info(this.createInternalInvitation.name, `Created internal invitation`, {
            userId: user.email,
            config,
            invitations,
        });
        return invitations;
    }

    async validateInvitationCode(code: string): Promise<string> {
        let valid = "INVITATION_CODE_VALID";
        try {
            const invitation = await this.invitationRepository.getByCode(code);
            if (!invitation) {
                throw new BadRequestError(ErrorMsg.INVITATION_CODE_NOT_FOUND);
            }
            invitation.verifyInvitation();
        } catch (error) {
            valid = (error as Error).message;
        }

        return valid;
    }

    async deleteInvitation(invitationCode: string) {
        const invitation = await this.invitationRepository.getByCode(invitationCode);
        if (!invitation) {
            throw new BadRequestError(ErrorMsg.INVITATION_CODE_NOT_FOUND);
        }
        await this.invitationRepository.delete(invitation);
        return invitation;
    }

    async useInvitation(invitation: Invitation, user: User): Promise<void> {
        invitation.assignUserToInvitation(user);
        await this.invitationRepository.save(invitation);
    }

    async getInvitationByCode(code: string): Promise<Invitation | undefined> {
        return this.invitationRepository.getByCode(code);
    }
}
