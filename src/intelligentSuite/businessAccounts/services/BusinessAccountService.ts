import {Service} from "typedi";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {ForbiddenError} from "../../../common/errors/ForbiddenError";
import {NotFoundError} from "../../../common/errors/NotFoundError";
import {BaseService} from "../../common/service/BaseService";
import {User} from "../../users/entities/User";
import {UserService} from "../../users/services/UserService";
import {BusinessAccount} from "../entities/BusinessAccount";
import {CreateBusinessAccountInput, UpdateBusinessAccountInput} from "../input/BusinessAccountInput";
import {BusinessAccountRepository} from "../repositories/BusinessAccountRepository";

@Service()
export class BusinessAccountService extends BaseService {
    static readonly CANCELED_MESSAGE = "CANCELED";
    constructor(
        private readonly businessAccountRepository: BusinessAccountRepository,
        private readonly userService: UserService,
    ) {
        super();
    }

    async createBusinessAccount(user: User, input: CreateBusinessAccountInput) {
        if (!user.isAdmin) {
            throw new ForbiddenError();
        }
        if (user.businessAccount) {
            throw new BadRequestError(ErrorMsg.USER_ALREADY_HAS_BUSINESS_ACCOUNT);
        }

        const businessAccount = BusinessAccount.create(input);
        businessAccount.users.push(user);

        return await this.businessAccountRepository.save(businessAccount);
    }

    async updateBusinessAccount(user: User, input: UpdateBusinessAccountInput) {
        if (!user.isAdmin) {
            throw new ForbiddenError();
        }

        const businessAccount = user.businessAccount;

        if (!businessAccount) {
            throw new NotFoundError(ErrorMsg.USER_NOT_HAVE_BUSINESS_ACCOUNT);
        }

        businessAccount.update(input);
        return await this.businessAccountRepository.save(businessAccount);
    }

    async cancelBusinessAccount(user: User) {
        if (!user.isAdmin) {
            throw new ForbiddenError();
        }

        const businessAccount = user.businessAccount;

        if (!businessAccount) {
            throw new NotFoundError(ErrorMsg.USER_NOT_HAVE_BUSINESS_ACCOUNT);
        }
        if (!this.validBusinessAccount(businessAccount)) {
            throw new ForbiddenError(ErrorMsg.CAN_NOT_CANCEL_COMPLETED_BUSINESS_ACCOUNT);
        }

        businessAccount.update({
            businessName: BusinessAccountService.CANCELED_MESSAGE + businessAccount.businessName,
        });
        businessAccount.deletedAt = new Date();
        await this.userService.deleteMe(user);
        await this.businessAccountRepository.save(businessAccount);
        return businessAccount;
    }

    private validBusinessAccount(businessAccount?: BusinessAccount): boolean {
        if (
            businessAccount &&
            businessAccount.brands &&
            (businessAccount.brands.length > 2 ||
                (businessAccount.brands?.length == 1 && businessAccount.brands[0].adAccounts))
        ) {
            return false;
        }
        return true;
    }
}
