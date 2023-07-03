import "reflect-metadata";

import {DateTimeResolver} from "graphql-scalars";
import {buildSchema, registerEnumType} from "type-graphql";
import {Container} from "typedi";
import {ErrorCode, ErrorMsg} from "../common/errors/ErrorCode";
import {SortType} from "../common/queries/Sort";
import {BrandStatus} from "../intelligentSuite/brands/entities/BrandStatus";
import {BrandResolver} from "../intelligentSuite/brands/resolvers/BrandResolver";
import {BusinessAccountResolver} from "../intelligentSuite/businessAccounts/resolvers/BusinessAccountResolver";
import {AdAccountType, SocialAccountType} from "../intelligentSuite/common/entities/Assets";
import {CampaignObjective} from "../intelligentSuite/common/entities/CampaignObjective";
import {Channel} from "../intelligentSuite/common/entities/Channel";
import {CreativeMetric, LabeledMetricValue} from "../intelligentSuite/common/entities/CreativeMetrics";
import {FileType} from "../intelligentSuite/common/entities/FileType";
import {Metric} from "../intelligentSuite/common/entities/Metrics";
import {OrderingDirection} from "../intelligentSuite/common/entities/OrderingDirection";
import {Platform} from "../intelligentSuite/common/entities/Platform";
import {Sector} from "../intelligentSuite/common/entities/Sector";
import {SuperClass} from "../intelligentSuite/common/entities/SuperClass";
import {InvitationType} from "../intelligentSuite/invitations/entities/Invitation";
import {InvitationResolver} from "../intelligentSuite/invitations/resolvers/InvitationResolver";
import {UserResolver} from "../intelligentSuite/users/resolvers/UserResolver";
import {subscriptionConnection} from "../pubsub/SubscriptionConnection";

const resolvers = [UserResolver, BusinessAccountResolver, BrandResolver, InvitationResolver] as const;

export const graphqlSchema = async (emitSchema = false, usePubSub = true) => {
    registerEnumType(OrderingDirection, {name: "OrderingDirection", description: "Ordering direction"});
    registerEnumType(BrandStatus, {name: "BrandStatus", description: "Brand Status"});
    registerEnumType(LabeledMetricValue, {name: "LabeledMetricValue", description: "Labeled Metric Value"});
    registerEnumType(ErrorCode, {name: "ErrorCode", description: "Api error codes"});
    registerEnumType(FileType, {name: "FileType"});
    registerEnumType(SortType, {name: "SortType"});
    registerEnumType(Sector, {name: "Sector"});
    registerEnumType(CampaignObjective, {name: "CampaignObjective", description: "Campaign objectives"});
    registerEnumType(Channel, {name: "Channel", description: "Channels"});
    registerEnumType(AdAccountType, {name: "AdAccountType", description: "AdAccountType"});
    registerEnumType(SocialAccountType, {name: "SocialAccountType", description: "SocialAccountType"});
    registerEnumType(SuperClass, {name: "SuperClass", description: "All SuperClass enum Values"});
    registerEnumType(Metric, {name: "Metric", description: "All metric enum values"});
    registerEnumType(InvitationType, {name: "InvitationType", description: "All invitation type enum values"});
    registerEnumType(CreativeMetric, {name: "CreativeMetric", description: "All creative metric enum values"});
    registerEnumType(ErrorMsg, {name: "ErrorMsg", description: "Error messages"});
    registerEnumType(Platform, {name: "Platform"});
    return buildSchema({
        resolvers,
        validate: true,
        container: Container,
        emitSchemaFile: emitSchema ? {sortedSchema: false} : false,
        pubSub: usePubSub ? await subscriptionConnection() : undefined,
        scalarsMap: [{type: Date, scalar: DateTimeResolver}],
    });
};
