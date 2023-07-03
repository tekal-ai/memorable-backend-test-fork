export class DbDate {
    static dateToDbParam(date: Date): string {
        return date.toISOString().replace("T", " ").replace("Z", "");
    }
}
