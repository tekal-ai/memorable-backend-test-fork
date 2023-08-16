import {Service} from "typedi";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {NotFoundError} from "../../../common/errors/NotFoundError";
import {UploadRequestInput} from "../../common/inputs/UploadRequestInput";
import {BaseService} from "../../common/service/BaseService";
import {UploadDataResponse} from "../../fileHandler/entities/UploadDataResponse";
import {FileHandlerService} from "../../fileHandler/service/FileHandlerService";
import {User} from "../../users/entities/User";
import Brand from "../entities/Brand";
import {BrandStatusInput, CreateBrandInput, UpdateBrandInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";

@Service()
export class BrandService extends BaseService {
    constructor(
        private readonly brandRepository: BrandRepository,
        private readonly fileHandlerService: FileHandlerService,
    ) {
        super();
    }

    /**
     * Creates a new brand associated with the user's business account.
     * @param user - The user creating the brand.
     * @param input - Brand details for creation.
     * @returns Brand The created brand.
     */
    async createBrand(user: User, input: CreateBrandInput) {
        this.logger.verbose(this.createBrand.name, `Creating brand for user`, {user: user.email});
        this.validateUserAdmin(user, this.createBrand.name);

        const brand = Brand.create(user.getBusinessAccount(), input);
        await this.brandRepository.save(brand);

        this.logger.debug(this.createBrand.name, `Created brand successfully`);
        return brand;
    }

    /**
     * Updates the optional fields of an existing brand.
     * @param user - The user updating the brand.
     * @param brandId - ID of the brand to be updated.
     * @param input - Updated brand details.
     * @returns Brand The updated brand.
     * */
    async updateBrand(user: User, brandId: string, input: UpdateBrandInput) {
        this.validateUserAdmin(user, this.createBrand.name);

        const brand = user.getBrand(brandId);
        brand.update(input);
        const updatedBrand = await this.brandRepository.save(brand);

        this.logger.debug(this.updateBrand.name, `Updated brand successfully`);
        return updatedBrand;
    }

    /**
     * Updates the status of an existing brand.
     * @param user - The user updating the brand status.
     * @param brandId - ID of the brand to be updated.
     * @param input - New status for the brand.
     * @returns Brand The brand with the updated status.
     */
    async updateBrandStatus(user: User, brandId: string, input: BrandStatusInput) {
        this.logger.debug(this.updateBrandStatus.name, `Updating brand ${brandId} with status ${input}`);
        this.validateUserAdmin(user, this.updateBrandStatus.name);
        return this.brandRepository.getById(brandId).then(async (brand) => {
            if (!brand) {
                throw new NotFoundError(ErrorMsg.BRAND_NOT_FOUND + `. Brand id: ${brandId}`);
            }
            this.validateUserAccessToBrand(user, brand, this.updateBrandStatus.name);

            brand.updateStatus(input.status);
            const updatedBrand = await this.brandRepository.save(brand);
            this.logger.debug(this.updateBrandStatus.name, `Successfully updated brand ${brandId} to status ${input}`);
            return updatedBrand;
        });
    }

    /**
     * Retrieves upload data necessary for brand logo upload.
     * @param user - The user requesting logo upload data.
     * @param uploadRequest - Logo information.
     * @returns UploadDataResponse Upload data necessary for logo upload.
     */
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
