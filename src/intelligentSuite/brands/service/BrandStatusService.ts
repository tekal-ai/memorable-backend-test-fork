import {Service} from "typedi";
import {BaseService} from "../../common/service/BaseService";
import {User} from "../../users/entities/User";
import {BrandStatusInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";
import {BrandStatusRepository} from "../repository/BrandStatusRepository";
import BrandStatus, {ValidBrandStatus} from "../entities/BrandStatus";
import {BadRequestError} from "../../../common/errors/BadRequestError";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import Brand from "../entities/Brand";

@Service()
export class BrandStatusService extends BaseService {
    constructor(private readonly brandStatusRepository: BrandStatusRepository) {
        super();
    }

    async createBrandStatus(brand: Brand, input: BrandStatusInput) {
        this.logger.info(this.createBrandStatus.name, "Creating new status for brand", {brand: brand.id})
        const newBrandStatus = BrandStatus.create(brand, input)
        return await this.brandStatusRepository.save(newBrandStatus)
    }

    isValidBrandStatus(status: string) {
        if (!Object.values(ValidBrandStatus).includes(status as ValidBrandStatus)) {
            throw new BadRequestError(ErrorMsg.INVALID_BRAND_STATUS)
        }
    }
}
