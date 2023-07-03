import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseSoftDeleteRepository} from "../../../common/repositories/BaseRepository";
import {BusinessAccount} from "../entities/BusinessAccount";
import {BusinessAccountQuerySet} from "./BusinessAccountQuerySet";

@Service()
export class BusinessAccountRepository extends BaseSoftDeleteRepository<BusinessAccount> {
    constructor(@InjectRepository(BusinessAccount) private repository: Repository<BusinessAccount>) {
        super(repository);
    }

    getQuerySet(): BusinessAccountQuerySet<BusinessAccount> {
        const queryBuilder = this.repository.createQueryBuilder("businessAccount");
        return new BusinessAccountQuerySet(queryBuilder, "businessAccount");
    }
}
