import {Config} from "../../config/Config";

export class GroupConcat {
    select(column: string, order: string, count: number, separator = "|") {
        if (Config.db.sql.type === "sqlite") {
            // substring index does not work in sqlite
            return `COALESCE(GROUP_CONCAT(${column} , "${separator}"), "")`;
        }

        return `COALESCE(SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT ${column} ORDER BY ${order} SEPARATOR "${separator}"), "${separator}", ${count}), "")`;
    }
}
