import {RedisPubSub} from "graphql-redis-subscriptions";
import {Container} from "typedi";
import {Config} from "../config/Config";

export const PUB_SUB_DI = "PubSubDI";

export const subscriptionConnection = async () => {
    const pubSub = new RedisPubSub({connection: Config.subscriptionUrl});
    Container.set(PUB_SUB_DI, pubSub);
    return pubSub;
};
