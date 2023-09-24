import {Service} from "typedi";
import {UploadRequestInput} from "../../common/inputs/UploadRequestInput";
import {BaseService} from "../../common/service/BaseService";
import {UploadDataResponse} from "../../fileHandler/entities/UploadDataResponse";
import {FileHandlerService} from "../../fileHandler/service/FileHandlerService";
import {User} from "../../users/entities/User";
import Brand from "../entities/Brand";
import BrandStatusHistory from "../entities/BrandStatusHistory";
import {BrandStatusInput, CreateBrandInput, UpdateBrandInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";
import {BrandStatusHistoryRepository} from "../repository/BrandStatusHistoryRepository";

@Service()
export class BrandService extends BaseService {
    constructor(
        private readonly brandStatusHistoryRepository: BrandStatusHistoryRepository,
        private readonly brandRepository: BrandRepository,
        private readonly fileHandlerService: FileHandlerService,
    ) {
        super();
    }

    async createBrand(user: User, input: CreateBrandInput) {
        this.logger.verbose(this.createBrand.name, `Creating brand for user`, {user: user.email});
        this.validateUserAdmin(user, this.createBrand.name);

        const brand = Brand.create(user.getBusinessAccount(), input);
        await this.brandRepository.save(brand);

        this.logger.debug(this.createBrand.name, `Created brand successfully`);
        return brand;
    }

    async updateBrand(user: User, brandId: string, input: UpdateBrandInput) {
        this.validateUserAdmin(user, this.createBrand.name);

        const brand = user.getBrand(brandId);
        brand.update(input);
        const updatedBrand = await this.brandRepository.save(brand);

        this.logger.debug(this.updateBrand.name, `Updated brand successfully`);
        return updatedBrand;
    }

    async updateBrandStatus(user: User, brandId: string, input: BrandStatusInput) {
        this.validateUserAdmin(user, this.updateBrandStatus.name);

        const brand = user.getBrand(brandId);
        const brandStatusChange = BrandStatusHistory.updateBrandStatus(user, brand, input.status);
        const updatedBrandStatusHistory = await this.brandStatusHistoryRepository.save(await brandStatusChange);

        this.logger.debug(updatedBrandStatusHistory.status.id, `Updated brand status successfully`);
        return updatedBrandStatusHistory;
    }

    async getLogoUploadData(user: User, uploadRequest: UploadRequestInput): Promise<UploadDataResponse> {
        this.logger.verbose(this.getLogoUploadData.name, `Getting logo upload data for user`, {user: user.email});
        const businessAccountId = user.getBusinessAccount().id;
        const result = await this.fileHandlerService.getLogoUploadData(
            businessAccountId,
            uploadRequest.mimeType,
            uploadRequest.extension,
        );
        this.logger.debug(this.getLogoUploadData.name, `Got logo upload data successfully`);
        return result;
    }
}
