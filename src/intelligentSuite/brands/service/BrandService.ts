import {Service} from "typedi";
import {UploadRequestInput} from "../../common/inputs/UploadRequestInput";
import {BaseService} from "../../common/service/BaseService";
import {UploadDataResponse} from "../../fileHandler/entities/UploadDataResponse";
import {FileHandlerService} from "../../fileHandler/service/FileHandlerService";
import {User} from "../../users/entities/User";
import Brand from "../entities/Brand";
import {CreateBrandInput, UpdateBrandInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";

@Service()
export class BrandService extends BaseService {
    constructor(
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
