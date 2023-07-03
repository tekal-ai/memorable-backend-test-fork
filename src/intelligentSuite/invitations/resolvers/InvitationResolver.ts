import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {UnauthorizedError} from "../../../common/errors/UnauthorizedError";
import {CurrentUser} from "../../../graphql/decorators/currentUserDecorator";
import {User} from "../../users/entities/User";
import {Invitation} from "../entities/Invitation";
import {InvitationInput} from "../input/InvitationInput";
import {InvitationService} from "../services/InvitationService";

@Service()
@Resolver()
export class InvitationResolver {
    constructor(private readonly invitationService: InvitationService) {}

    @Mutation((_returns) => [Invitation], {description: "Generate referral invitations"})
    async createReferralInvitations(
        @CurrentUser() currentUser: User,
        @Arg("numberOfInvitations") numberOfInvitations: number,
    ) {
        return await this.invitationService.createReferralInvitations(currentUser, numberOfInvitations);
    }
    @Mutation((_returns) => [Invitation], {description: "Generate internal invitations"})
    async createInternalInvitations(
        @CurrentUser() currentUser: User,
        @Arg("config", () => InvitationInput) config: InvitationInput,
    ) {
        return await this.invitationService.createInternalInvitation(currentUser, config);
    }

    @Query((_returns) => String, {description: "Validate Invitation Code"})
    async validateInvitationCode(@Arg("invitationCode") invitationCode: string) {
        return await this.invitationService.validateInvitationCode(invitationCode);
    }

    @Mutation((_returns) => Boolean, {description: "Delete Invitation Code"})
    async deleteInvitation(@CurrentUser() currentUser: User, @Arg("invitationCode") invitationCode: string) {
        if (currentUser.id != "1") {
            throw new UnauthorizedError();
        }
        return await this.invitationService.deleteInvitation(invitationCode);
    }
}
