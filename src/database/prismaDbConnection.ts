import {PrismaClient} from "@prisma/client";
import {Config} from "../config/Config";
import {GlobalLogger} from "../logging/GlobalLogger";

export class RepositoryDataNotFoundError extends Error {}

process.env.CREATIVE_DATABASE_URL = `${Config.db.creativeDb.url}?${Config.db.creativeDb.options}`;
process.env.INTEGRATION_DATABASE_URL = `${Config.db.integrationDb.url}?${Config.db.integrationDb.options}`;
GlobalLogger.verbose("DATABASE_CONNECTION_CONFIG", "Creative DATABASE URL", {
    envCreativeDatabaseUrl: process.env.CREATIVE_DATABASE_URL ?? "NOT SET",
    envIntegrationDatabaseUrl: process.env.INTEGRATION_DATABASE_URL ?? "NOT SET",
});

const creativePrismaClient =
    process.env.NODE_ENV !== "test"
        ? new PrismaClient({
              datasources: {
                  db: {
                      url: `${Config.db.creativeDb.url}?${Config.db.creativeDb.options}`,
                  },
              },
          })
        : new PrismaClient();
const integrationPrismaClient =
    process.env.NODE_ENV !== "test"
        ? new PrismaClient({
              datasources: {
                  db: {
                      url: `${Config.db.integrationDb.url}?${Config.db.integrationDb.options}`,
                  },
              },
              log: [
                  {
                      emit: "event",
                      level: "query",
                  },
                  {
                      emit: "stdout",
                      level: "error",
                  },
                  {
                      emit: "stdout",
                      level: "info",
                  },
                  {
                      emit: "stdout",
                      level: "warn",
                  },
              ],
          })
        : new PrismaClient();
// integrationPrismaClient.$on("beforeExit", (e) => {
//     console.log("Query: " + e.query);
//     console.log("Params: " + e.params);
//     console.log("Duration: " + e.duration + "ms");
// });

export {creativePrismaClient, integrationPrismaClient};
