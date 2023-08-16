import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {ForbiddenError} from "../../../common/errors/ForbiddenError";
import {Logger} from "../../../logging/Logger";
import {User} from "../../users/entities/User";

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

}
