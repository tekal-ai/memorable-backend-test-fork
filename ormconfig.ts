// File used only to generate migrations

import {Config} from "./src/config/Config";

export default {
    synchronize: false,
    logging: false,
    entities: ["./src/**/entities/**/*.{ts,js}"],
    migrations: ["./src/database/intelligentSuiteMigrations/*.{ts,js}"],
    migrationsRun: false,
    ...Config.db.sqlMigrations,
};
