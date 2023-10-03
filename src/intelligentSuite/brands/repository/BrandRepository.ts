import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseRepository} from "../../../common/repositories/BaseRepository";
import Brand from "../entities/Brand";
import {BrandQuerySet} from "./BrandQuerySet";

@Service()
export class BrandRepository extends BaseRepository<Brand> {
    async updateBrandAssets(brand: Brand, adAccountsIds: number[], socialAccountsIds: number[]) {
        if (adAccountsIds.length > 0) {
            brand.adAccounts = adAccountsIds.map((id) => {
                return id.toString();
            });
        }
        if (socialAccountsIds.length == 0) {
            brand.socialAccounts = socialAccountsIds.map((id) => {
                return id.toString();
            });
        }

        await this.save(brand);
    }
    constructor(@InjectRepository(Brand) private repository: Repository<Brand>) {
        super(repository);
    }

    async getByIDWithStatus(brandId: string){
        return this.getQuerySet().filterById(brandId).withBrandStatus().getOne()
    }

    getQuerySet(): BrandQuerySet<Brand> {
        const queryBuilder = this.repository.createQueryBuilder("Brand");
        return new BrandQuerySet(queryBuilder, "Brand");
    }
}
