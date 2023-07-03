import {Repository} from "typeorm";
import {DeepPartial} from "typeorm/common/DeepPartial";
import {BaseEntity} from "../entities/BaseEntity";
import {SoftDeleteEntity} from "../entities/SoftDeleteEntity";
import {QuerySet} from "./QuerySet";

export abstract class BaseRepository<T extends BaseEntity> {
    private entityRepository: Repository<T>;

    protected constructor(repository: Repository<T>) {
        this.entityRepository = repository;
    }

    abstract getQuerySet(): QuerySet<T>;

    async save<TEntity extends DeepPartial<T>>(entity: TEntity): Promise<T> {
        return this.entityRepository.save(entity);
    }

    async saveMultiple<TEntity extends DeepPartial<T>>(entities: TEntity[]): Promise<T[]> {
        return this.entityRepository.save(entities);
    }

    async update<TEntity extends DeepPartial<T>>(entity: TEntity): Promise<T> {
        return this.entityRepository.save(entity);
    }

    async saveAndRetrieve<TEntity extends DeepPartial<T>>(entity: TEntity): Promise<T | undefined> {
        const saved = await this.save(entity);
        return this.getById(saved.id);
    }

    async getById(id: string): Promise<T | undefined> {
        return this.getQuerySet().filterById(id).getOne();
    }

    async getByIds(ids: string[]): Promise<T[]> {
        if (ids.length === 0) {
            return [];
        }
        return this.getQuerySet().filterByIds(ids).getMany();
    }

    async getAll(): Promise<T[]> {
        return this.getQuerySet().getMany();
    }

    async delete(entity: T): Promise<void> {
        await this.entityRepository.delete(entity.id);
    }
}

export abstract class BaseSoftDeleteRepository<T extends SoftDeleteEntity> extends BaseRepository<T> {
    private softDeleteEntityRepository: Repository<T>;

    protected constructor(repository: Repository<T>) {
        super(repository);
        this.softDeleteEntityRepository = repository;
    }

    async delete(entity: T): Promise<void> {
        await this.getQuerySet().filterById(entity.id).getQueryBuilder().softDelete().execute();
    }

    async deleteMany(entities?: T[]): Promise<void> {
        if (!entities || entities.length === 0) return;

        await this.getQuerySet()
            .filterByIds(entities.map((entity) => entity.id))
            .getQueryBuilder()
            .softDelete()
            .execute();
    }
}
