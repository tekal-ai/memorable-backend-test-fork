import {Service} from "typedi";
import {BaseService} from "../../common/service/BaseService";
import {User} from "../../users/entities/User";
import {BrandAssetsResponse} from "../entities/BrandAssetsResponse";
import {BrandAssetsInput} from "../input/BrandInput";
import {BrandRepository} from "../repository/BrandRepository";

@Service()
export class BrandAccountsService extends BaseService {
    constructor(private readonly brandRepository: BrandRepository) {
        super();
    }

    async updateBrandAssets(user: User, brandId: string, input: BrandAssetsInput) {
        this.logger.verbose(this.updateBrandAssets.name, `Updating brand assets for user`, {user: user.email});
        this.validateUserAdmin(user, this.updateBrandAssets.name);

        const brand = user.getBrand(brandId);

        brand.socialAccounts =
            input.socialAccount?.map((socialAccount) => {
                return socialAccount.id.toString();
            }) ?? [];
        brand.adAccounts =
            input.adAccount?.map((adAccount) => {
                return adAccount.id.toString();
            }) ?? [];
        await this.brandRepository.save(brand);
        this.logger.debug(this.updateBrandAssets.name, `Updated brand assets successfully`);
        return brand;
    }

    async getBrandAssets(user: User, brandId: string) {
        this.logger.verbose(this.getBrandAssets.name, `Getting brand assets for user`, {user: user.email, brandId});
        const brand = user.getBrand(brandId);

        const BrandResponse: BrandAssetsResponse = {
            adAccounts: brand.adAccounts?.map((adAccount) => {
                return {
                    id: Number(adAccount),
                };
            }),
            socialAccounts: brand.socialAccounts?.map((socialAccount) => {
                return {
                    id: Number(socialAccount),
                };
            }),
        };

        this.logger.debug(this.getBrandAssets.name, `Got brand assets successfully`, {response: BrandResponse});
        return BrandResponse;
    }
}
