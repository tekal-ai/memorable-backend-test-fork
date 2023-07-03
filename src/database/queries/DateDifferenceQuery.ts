import {Config} from "../../config/Config";

export class DateDifferenceQuery {
    differenceInSeconds(startDate: string, endDate: string): string {
        if (Config.db.sql.type === "sqlite") {
            return `(JULIANDAY(${endDate}) - JULIANDAY(${startDate})) * 24 * 60 * 60`;
        }

        return `TIMESTAMPDIFF(SECOND, ${startDate}, ${endDate})`;
    }

    differenceInSecondsFromNow(startDate: string): string {
        return this.differenceInSeconds(startDate, `"${new Date().toISOString()}"`);
    }
}
