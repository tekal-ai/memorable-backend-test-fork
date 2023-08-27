import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {CurrentUser} from "../../../graphql/decorators/currentUserDecorator";
import {UploadRequestInput} from "../../common/inputs/UploadRequestInput";
import {UploadDataResponse} from "../../fileHandler/entities/UploadDataResponse";
import {User} from "../../users/entities/User";
import Brand from "../entities/Brand";
import {BrandAssetsResponse} from "../entities/BrandAssetsResponse";
import {BrandAssetsInput, CreateBrandInput, UpdateBrandInput, UpdateBrandStatusInput} from "../input/BrandInput";
import {BrandAccountsService} from "../service/BrandAccountsService";
import {BrandService} from "../service/BrandService";

@Service()
@Resolver()
export class BrandResolver {
    constructor(
        private readonly brandService: BrandService,
        private readonly brandAccountsService: BrandAccountsService,
    ) {}

    @Mutation((_returns) => Brand, {
        description: "Creates a business Account for the provided business admin",
    })
    async createBrand(@CurrentUser() user: User, @Arg("input") input: CreateBrandInput) {
        return await this.brandService.createBrand(user, input);
    }

    @Mutation((_returns) => Brand, {description: "Updates optional fields of a brand"})
    async updateBrand(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: UpdateBrandInput,
    ) {
        return await this.brandService.updateBrand(user, brandId, input);
    }

    @Mutation((_returns) => Brand, {description: "Updates status of a brand"})
    async updateBrandStatus(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: UpdateBrandStatusInput,
    ) {
        return await this.brandService.updateBrandStatus(user, brandId, input);
    }

    @Mutation((_returns) => Brand, {description: "Updates assets of a brand"})
    async updateBrandAssets(
        @CurrentUser() user: User,
        @Arg("brandId") brandId: string,
        @Arg("input") input: BrandAssetsInput,
    ) {
        return await this.brandAccountsService.updateBrandAssets(user, brandId, input);
    }

    @Mutation((_returns) => UploadDataResponse, {description: "Uploads brand logo"})
    async requestLogoUploadData(@CurrentUser() user: User, @Arg("input") input: UploadRequestInput) {
        return await this.brandService.getLogoUploadData(user, input);
    }

    @Query((_returns) => BrandAssetsResponse, {
        description: "Returns the Business Asset available in integration for business Account",
    })
    async getBrandAssets(@CurrentUser() user: User, @Arg("brandId") brandId: string): Promise<BrandAssetsResponse> {
        return await this.brandAccountsService.getBrandAssets(user, brandId);
    }
}
