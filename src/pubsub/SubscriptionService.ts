import {PubSubEngine} from "type-graphql";
import {Inject, Service} from "typedi";
import {PUB_SUB_DI} from "./SubscriptionConnection";
import {SubscriptionTopics} from "./SubscriptionTopics";

@Service()
export class SubscriptionService {
    public constructor(@Inject(PUB_SUB_DI) private pubSub: PubSubEngine) {}

    public async publish<T>(topic: SubscriptionTopics, data: T): Promise<void> {
        await this.pubSub.publish(topic, data);
    }
}
