import {suite, test} from "@testdeck/mocha";
import * as _chai from "chai";
import {anyOfClass, anyString, instance, mock, verify, when} from "ts-mockito";
import {BrandService} from "../src/intelligentSuite/brands/service/BrandService";
import {BrandRepository} from "../src/intelligentSuite/brands/repository/BrandRepository";
import {BrandStatus} from "../src/intelligentSuite/brands/entities/BrandStatus";
import {FileHandlerService} from "../src/intelligentSuite/fileHandler/service/FileHandlerService";
import {User} from "../src/intelligentSuite/users/entities/User";
import {CreateBusinessAccountInput} from "../src/intelligentSuite/businessAccounts/input/BusinessAccountInput";
import {BusinessAccount} from "../src/intelligentSuite/businessAccounts/entities/BusinessAccount";
import Brand from "../src/intelligentSuite/brands/entities/Brand";
import {CreateBrandInput} from "../src/intelligentSuite/brands/input/BrandInput";
import {Sector} from "../src/intelligentSuite/common/entities/Sector";
import {NotFoundError} from "../src/common/errors/NotFoundError";
import {ForbiddenError} from "../src/common/errors/ForbiddenError";

_chai.should();

@suite
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BrandServiceTest {
    private brandServiceMock: BrandService = mock(BrandService);
    private brandRepositoryMock: BrandRepository = mock(BrandRepository);
    private fileHandlerService: FileHandlerService = mock(FileHandlerService);

    private adminUser: User;
    private brandMock: Brand;
    private businessMock: BusinessAccount;

    before() {
        this.brandServiceMock = new BrandService(instance(this.brandRepositoryMock), this.fileHandlerService);

        const businessInfo: CreateBusinessAccountInput = new CreateBusinessAccountInput();
        businessInfo.businessName = "test business";
        this.businessMock = BusinessAccount.create(businessInfo);

        this.adminUser = User.createUser({
            name: "test",
            email: "test@test.com",
            isAdmin: true,
            businessAccount: this.businessMock,
        });

        const brandInput: CreateBrandInput = new CreateBrandInput();
        brandInput.name = "test brand";
        brandInput.sector = [Sector.HealthcareServices];
        this.brandMock = Brand.create(this.businessMock, brandInput);
        this.businessMock.brands = [this.brandMock];
        this.brandMock.status = BrandStatus.IN_PROGRESS;
    }

    @test
    async shouldUpdateBrandStatus_success() {
        when(this.brandRepositoryMock.getById(anyString())).thenResolve(this.brandMock);

        await this.brandServiceMock.updateBrand(this.adminUser, this.brandMock.id, {
            status: BrandStatus.DATA_READY,
        });

        verify(this.brandRepositoryMock.save(anyOfClass(Brand))).times(1);
        this.brandMock.status.should.equal(BrandStatus.DATA_READY);
    }

    @test
    async shouldCreateBrandDefaultStatus_success() {
        const createdBrand = await this.brandServiceMock.createBrand(this.adminUser, {
            name: "test brand",
            sector: [Sector.ToysAndGames],
        });

        verify(this.brandRepositoryMock.save(anyOfClass(Brand))).times(1);
        createdBrand.status.should.equal(BrandStatus.IN_PROGRESS);
    }

    @test
    async shouldThrowNotFoundError_whenBrandNotExists() {
        const brandId = "nonExistentBrandId";

        when(this.brandRepositoryMock.getById(brandId)).thenResolve(undefined);

        const resultPromise = this.brandServiceMock.updateBrand(this.adminUser, brandId, {
            status: BrandStatus.DATA_READY,
        });

        return resultPromise
            .then(() => {
                throw new Error("Expected error to be thrown, but no error was thrown.");
            })
            .catch((error) => {
                error.should.be.instanceOf(NotFoundError);
                error.message.should.contain("USER_NOT_HAVE_ACCESS_TO_BRAND");
            });
    }

    @test
    async shouldThrowForbiddenError_whenUserNotAdmin() {
        const notAdminUser = this.adminUser;
        notAdminUser.isAdmin = false;

        const resultPromise = this.brandServiceMock.updateBrand(notAdminUser, this.brandMock.id, {
            status: BrandStatus.DATA_READY,
        });

        return resultPromise
            .then(() => {
                throw new Error("Expected error to be thrown, but no error was thrown.");
            })
            .catch((error) => {
                error.should.be.instanceOf(ForbiddenError);
                error.message.should.contain("NOT_ENOUGH_PERMISSIONS");
            });
    }

    @test
    async shouldThrowError_whenUserHasNoBusinessAccount() {
        delete this.adminUser.businessAccount;

        when(this.brandRepositoryMock.getById(anyString())).thenResolve(this.brandMock);

        const resultPromise = this.brandServiceMock.updateBrand(this.adminUser, this.brandMock.id, {
            status: BrandStatus.DATA_READY,
        });

        return resultPromise
            .then(() => {
                throw new Error("Expected error to be thrown, but no error was thrown.");
            })
            .catch((error) => {
                error.message.should.contain("USER_NOT_HAVE_BUSINESS_ACCOUNT");
            });
    }

    @test
    async shouldThrowError_whenUserHasNoAccessToTheBrand() {
        const businessInfo: CreateBusinessAccountInput = new CreateBusinessAccountInput();
        businessInfo.businessName = "other test business";
        const business: BusinessAccount = BusinessAccount.create(businessInfo);
        business.brands = [];
        this.adminUser.businessAccount = business;
        when(this.brandRepositoryMock.getById(anyString())).thenResolve(this.brandMock);

        const resultPromise = this.brandServiceMock.updateBrand(this.adminUser, this.brandMock.id, {
            status: BrandStatus.DATA_READY,
        });

        return resultPromise
            .then(() => {
                throw new Error("Expected error to be thrown, but no error was thrown.");
            })
            .catch((error) => {
                error.message.should.contain("USER_NOT_HAVE_ACCESS_TO_BRAND");
            });
    }
}
