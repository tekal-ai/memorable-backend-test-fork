import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseRepository} from "../../../common/repositories/BaseRepository";
import {User} from "../entities/User";
import {UserQuerySet} from "./UserQuerySet";

@Service()
export class UserRepository extends BaseRepository<User> {
    constructor(@InjectRepository(User) private repository: Repository<User>) {
        super(repository);
    }

    getQuerySet(eagerRelations = true): UserQuerySet<User> {
        const queryBuilder = this.repository.createQueryBuilder("user");
        const querySet = new UserQuerySet(queryBuilder, "user");
        return eagerRelations ? querySet.eagerRelations() : querySet;
    }

    async getByEmail(email: string) {
        return this.getQuerySet().withEmail(email).getOne();
    }
}
