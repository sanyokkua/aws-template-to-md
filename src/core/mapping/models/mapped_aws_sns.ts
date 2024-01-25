import { CommonMappedResource } from "./mapped_common";

export interface SnsTopicSubscription {
    protocol: string;// AwsSNSSubscription.Properties.Protocol
    endpoint: string;// AwsSNSSubscription.Properties.Endpoint
}

export interface MappedSNSTopic extends CommonMappedResource {
    subscriptions: SnsTopicSubscription[];
}