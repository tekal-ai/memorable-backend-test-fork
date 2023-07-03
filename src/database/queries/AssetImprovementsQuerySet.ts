import {BaseEntity} from "../../common/entities/BaseEntity";
import {SortType} from "../../common/queries/Sort";
import {QuerySet} from "../../common/repositories/QuerySet";

export class AssetImprovementsQuerySet<T extends BaseEntity> extends QuerySet<T> {
    sortByAssetMetricImprovement(metricAliasScore: string, sortType: SortType): this {
        this.queryBuilder.orderBy(`${this.metricImprovementFormula(metricAliasScore)}`, sortType);
        return this;
    }

    selectAssetMetricImprovementAverage(metricAliasScore: string, condition?: string | undefined): this {
        this.queryBuilder = this.innerJoinSubQuery(this, condition).getQueryBuilder();

        this.queryBuilder = this.queryBuilder.select(
            `AVG(${this.metricImprovementFormula(metricAliasScore)})`,
            "averageImprovement",
        );

        return this;
    }

    selectAssetConversionMetricImprovementAverage(conversionMetricAliasScore: string): this {
        this.queryBuilder = this.queryBuilder.select(
            `AVG(${this.metricImprovementFormula(conversionMetricAliasScore)})`,
            "averageImprovement",
        );
        return this;
    }

    private metricImprovementFormula(metricAliasScore: string | undefined): string {
        return `COALESCE((${this.entityName}Alternatives${metricAliasScore} / ${this.entityName}OriginalAsset${metricAliasScore}) - 1, 0)`;
    }
}
