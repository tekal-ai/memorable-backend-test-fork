import {Arg, Mutation, Resolver} from "type-graphql";
import {Service} from "typedi";
import {CurrentUser} from "../../../graphql/decorators/currentUserDecorator";
import {User} from "../../users/entities/User";
import {BusinessAccount} from "../entities/BusinessAccount";
import {CreateBusinessAccountInput, UpdateBusinessAccountInput} from "../input/BusinessAccountInput";
import {BusinessAccountService} from "../services/BusinessAccountService";

@Service()
@Resolver()
export class BusinessAccountResolver {
    constructor(private readonly businessAccountService: BusinessAccountService) {}

    @Mutation((_returns) => BusinessAccount, {
        description: "Creates a business Account for the provided business admin",
    })
    async createBusinessAccount(@CurrentUser() user: User, @Arg("input") input: CreateBusinessAccountInput) {
        return await this.businessAccountService.createBusinessAccount(user, input);
    }

    @Mutation((_returns) => BusinessAccount, {description: "Updates optional fields of a business Account"})
    async updateBusinessAccount(@CurrentUser() user: User, @Arg("input") input: UpdateBusinessAccountInput) {
        return await this.businessAccountService.updateBusinessAccount(user, input);
    }
    @Mutation((_returns) => BusinessAccount, {description: "Cancel Business Account"})
    async cancelBusinessAccount(@CurrentUser() user: User) {
        return await this.businessAccountService.cancelBusinessAccount(user);
    }
}
