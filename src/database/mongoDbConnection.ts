import mongoose, {Mongoose} from "mongoose";
import "reflect-metadata";
import {Config} from "../config/Config";

export class MongoDbConnection {
    private static instance: Mongoose | null = null;

    public static async connect(): Promise<void> {
        if (Config.db.mongo && !MongoDbConnection.instance) {
            MongoDbConnection.instance = await mongoose.connect(Config.db.mongo, {dbName: "dashboard"});
        }
    }

    public static async disconnect(): Promise<void> {
        if (MongoDbConnection.instance) {
            await MongoDbConnection.instance.disconnect();
            MongoDbConnection.instance = null;
        }
    }
}
