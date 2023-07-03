import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {BaseSoftDeleteRepository} from "../../../common/repositories/BaseRepository";
import {Invitation} from "../entities/Invitation";
import {InvitationQuerySet} from "./InvitationQuerySet";

@Service()
export class InvitationRepository extends BaseSoftDeleteRepository<Invitation> {
    constructor(@InjectRepository(Invitation) private repository: Repository<Invitation>) {
        super(repository);
    }

    getQuerySet(eagerRelations = true): InvitationQuerySet<Invitation> {
        const queryBuilder = this.repository
            .createQueryBuilder("invitation")
            .leftJoinAndSelect(`invitation.businessAccount`, "businessAccount");
        const querySet = new InvitationQuerySet(queryBuilder, "invitation");

        return eagerRelations ? querySet.eagerRelations() : querySet;
    }

    async getByCode(code: string) {
        return this.getQuerySet(true).sortByAvailable().withUser().withCode(code).getOne();
    }
}
