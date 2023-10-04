import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseRepository} from "../../../common/repositories/BaseRepository";
import Brand from "../entities/Brand";
import {BrandQuerySet} from "./BrandQuerySet";
import BrandStatus from "../entities/BrandStatus";
import {BrandStatusQuerySet} from "./BrandStatusQuerySet";

@Service()
export class BrandStatusRepository extends BaseRepository<BrandStatus> {
    constructor(@InjectRepository(BrandStatus) private repository: Repository<BrandStatus>) {
        super(repository);
    }

    getQuerySet(): BrandStatusQuerySet<BrandStatus> {
        const queryBuilder = this.repository.createQueryBuilder("BrandStatus");
        return new BrandQuerySet(queryBuilder, "BrandStatus");
    }
}
