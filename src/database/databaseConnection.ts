import "reflect-metadata";
import {createConnection, useContainer} from "typeorm";
import {Container} from "typeorm-typedi-extensions";
import {Config} from "../config/Config";

export const createDB = async () => {
    const options = {
        entities: [__dirname + "/../../src/**/entities/**/*.{ts,js}"],
        synchronize: false,
        logging: false,
        migrations: [__dirname + "/intelligentSuiteMigrations/*.{ts,js}"],
        migrationsRun: false,
        bigNumberStrings: false,
        ...Config.db.sql,
    };

    useContainer(Container);

    return createConnection(options);
};
