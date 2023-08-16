import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {ForbiddenError} from "../../../common/errors/ForbiddenError";
import {Logger} from "../../../logging/Logger";
import {User} from "../../users/entities/User";
import Brand from "../../brands/entities/Brand";

export abstract class BaseService {
    protected logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    protected validateUserAdmin(user: User, functionName?: string) {
        if (!user.isAdmin) {
            throw new ForbiddenError(
                ErrorMsg.NOT_ENOUGH_PERMISSIONS,
                this.logger,
                functionName ?? this.validateUserAdmin.name,
            );
        }
    }

    protected validateUserAccessToBrand(user: User, brand: Brand, functionName?: string) {
        if (!user.getBusinessAccount()) {
            throw new ForbiddenError(
                ErrorMsg.USER_NOT_HAVE_BUSINESS_ACCOUNT,
                this.logger,
                functionName ?? this.validateUserAccessToBrand.name,
            );
        }
        if (user.getBusinessAccount().id != brand.businessAccount.id) {
            throw new ForbiddenError(
                ErrorMsg.USER_NOT_HAVE_ACCESS_TO_BRAND,
                this.logger,
                functionName ?? this.validateUserAccessToBrand.name,
            );
        }
    }
}
