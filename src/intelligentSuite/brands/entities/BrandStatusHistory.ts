import {ObjectType} from "type-graphql";
import {Entity, getRepository, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../../../common/entities/BaseEntity";
import {ErrorMsg} from "../../../common/errors/ErrorCode";
import {NotFoundError} from "../../../common/errors/NotFoundError";
import {User} from "../../users/entities/User";
import Brand from "./Brand";
import BrandStatus from "./BrandStatus";

@ObjectType()
@Entity()
export default class BrandStatusHistory extends BaseEntity {
    @ManyToOne(() => Brand)
    @JoinColumn()
    brand!: Brand;

    @ManyToOne(() => Brand)
    @JoinColumn()
    status!: BrandStatus;

    @ManyToOne(() => User)
    @JoinColumn()
    user!: User;

    static async updateBrandStatus(user: User, brand: Brand, statusName: string): Promise<BrandStatusHistory> {
        const brandStatusEntry = new BrandStatusHistory();
        brandStatusEntry.setId();
        brandStatusEntry.status = await BrandStatusHistory.getBrandStatus(statusName);
        brandStatusEntry.brand = brand;
        brandStatusEntry.user = user;
        return brandStatusEntry;
    }

    private static async getBrandStatus(statusName: string) {
        const brandStatus = await getRepository(BrandStatus).findOne({where: {status: statusName}});
        if (!brandStatus) {
            throw new NotFoundError(ErrorMsg.BRAND_STATUS_INVALID);
        }
        return brandStatus;
    }
}
