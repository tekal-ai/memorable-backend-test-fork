import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseRepository} from "../../../common/repositories/BaseRepository";
import BrandStatusHistory from "../entities/BrandStatusHistory";
import {BrandStatusHistoryQuerySet} from "./BrandStatusHistoryQuerySet";

@Service()
export class BrandStatusHistoryRepository extends BaseRepository<BrandStatusHistory> {
    constructor(@InjectRepository(BrandStatusHistory) private repository: Repository<BrandStatusHistory>) {
        super(repository);
    }

    getQuerySet(): BrandStatusHistoryQuerySet<BrandStatusHistory> {
        const queryBuilder = this.repository.createQueryBuilder("BrandStatusHistory");
        return new BrandStatusHistoryQuerySet(queryBuilder, "BrandStatusHistory");
    }
}
