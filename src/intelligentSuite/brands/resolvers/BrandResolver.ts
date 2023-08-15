import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {CurrentUser} from "../../../graphql/decorators/currentUserDecorator";
import {UploadRequestInput} from "../../common/inputs/UploadRequestInput";
import {UploadDataResponse} from "../../fileHandler/entities/UploadDataResponse";
import {User} from "../../users/entities/User";
import Brand from "../entities/Brand";
import {BrandAssetsResponse} from "../entities/BrandAssetsResponse";
import {BrandAssetsInput, BrandStatusInput, CreateBrandInput, UpdateBrandInput} from "../input/BrandInput";
import {BrandAccountsService} from "../service/BrandAccountsService";
import {BrandService} from "../service/BrandService";

@Service()
@Resolver()
export class BrandResolver {
    constructor(
        private readonly brandService: BrandService,
        private readonly brandAccountsService: BrandAccountsService,
    ) {}

    /**
     * Creates a new brand associated with the provided user admin.
     * @param user - The authenticated user (admin).
     * @param input - Brand details for creation.
     * @returns Brand The newly created brand.
     */
    @Mutation((_returns) => Brand, {
        description: "Creates a business Account for the provided user admin",
    })
    async createBrand(@CurrentUser() user: User, @Arg("input") input: CreateBrandInput) {
        return await this.brandService.createBrand(user, input);
    }

    /**
     * Updates optional fields of a brand.
     * @param user - The authenticated user (admin).
     * @param brandId - The ID of the brand to update.
     * @param input - Updated brand details.
     * @returns Brand The updated brand.
     */
    @Mutation((_returns) => Brand, {description: "Updates optional fields of a brand"})
    async updateBrand(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: UpdateBrandInput,
    ) {
        return await this.brandService.updateBrand(user, brandId, input);
    }

    /**
     * Updates assets of a brand.
     * @param user - The authenticated user (admin).
     * @param brandId - The ID of the brand to update assets.
     * @param input - Updated brand account assets' details.
     * @returns Brand The brand with updated assets.
     */
    @Mutation((_returns) => Brand, {description: "Updates assets of a brand"})
    async updateBrandAssets(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: BrandAssetsInput,
    ) {
        return await this.brandAccountsService.updateBrandAssets(user, brandId, input);
    }

    /**
     * Updates the status of a brand.
     * @param user - The authenticated user (admin).
     * @param brandId - The ID of the brand to update the status for.
     * @param input - New status for the brand. Possible values: IN_PROGRESS, DATA_READY, MODEL_TRAINING, READY
     * @returns Brand The brand with updated status.
     */
    @Mutation((_returns) => Brand, {description: "Updates status of a brand"})
    async updateBrandStatus(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: BrandStatusInput,
    ) {
        return await this.brandService.updateBrandStatus(user, brandId, input);
    }

    /**
     * Get upload data for brand logo.
     * @param user - The authenticated user.
     * @param input - Upload request details.
     * @returns UploadDataResponse Logo upload information.
     */
    @Mutation((_returns) => UploadDataResponse, {description: "Uploads brand logo"})
    async requestLogoUploadData(@CurrentUser() user: User, @Arg("input") input: UploadRequestInput) {
        return await this.brandService.getLogoUploadData(user, input);
    }

    /**
     * Retrieves brand assets available in integration for a business account.
     * @param user - The authenticated user.
     * @param brandId - The ID of the brand to retrieve assets for.
     * @returns BrandAssetsResponse Brand assets containing available social or ad accounts.
     */
    @Query((_returns) => BrandAssetsResponse, {
        description: "Returns the Business Asset available in integration for business Account",
    })
    async getBrandAssets(@CurrentUser() user: User, @Arg("brandId") brandId: string): Promise<BrandAssetsResponse> {
        return await this.brandAccountsService.getBrandAssets(user, brandId);
    }
}
