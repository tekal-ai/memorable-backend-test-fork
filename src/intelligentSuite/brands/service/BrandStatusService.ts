import {Service} from "typedi";
import {BaseService} from "../../common/service/BaseService";
import {User} from "../../users/entities/User";
import {BrandStatusInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";
import {BrandStatusRepository} from "../repository/BrandStatusRepository";
import BrandStatus from "../entities/BrandStatus";

@Service()
export class BrandStatusService extends BaseService {
    constructor(private readonly brandRepository: BrandRepository, private readonly brandStatusRepository: BrandStatusRepository) {
        super();
    }

    async updateBrandStatus(user: User, brandId: string, input: BrandStatusInput) {
        this.logger.verbose(this.updateBrandStatus.name, `Updating status for brand`, {brand: brandId});
        this.validateUserAdmin(user, this.updateBrandStatus.name);

        const brand = user.getBrand(brandId);

        if (brand.status?.status == input.status) {
            this.logger.info(this.updateBrandStatus.name, "the brand is actually in the selected status, nothing to update")
            return brand
        }

        const newBrandStatus = BrandStatus.create(brand, input)
        await this.brandStatusRepository.save(newBrandStatus)

        brand.status = newBrandStatus
        await this.brandRepository.save(brand);
        this.logger.debug(this.updateBrandStatus.name, `Updated brand status successfully`);
        return brand;
    }
}
