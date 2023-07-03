import {Config} from "../../config/Config";

export class RegexQuery {
    regex(field: string, values: string[], leftRegex = true, rightRegex = true, negated = false): string {
        const negatedQuery = negated ? "NOT " : "";

        if (Config.db.sql.type === "sqlite") {
            // REGEXP does not work in sqlite
            const regexValues = values.map((value) => `${leftRegex ? "%" : ""}${value}${rightRegex ? "%" : ""}`);
            return regexValues.map((value) => `${field} ${negatedQuery} LIKE '${value}'`).join(" AND ");
        }

        const regexValues = values.map((value) => `${leftRegex ? "(.*)" : ""}${value}${rightRegex ? "(.*)" : ""}`);
        return `${field} ${negatedQuery} REGEXP "${regexValues.join("|")}"`;
    }
}
