import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { SNSTopic }                                   from "../models";
import { AWS_SNS_Subscription, AWS_SNS_Topic }        from "../../aws/constants";
import { AwsSNSSubscription, AwsSNSTopic }            from "../../aws/models/sns/sns";

// TODO:
export function getMappedSNSTopic(resources: [ResourcesMappedByType, ResourcesMappedById]): SNSTopic[] {
    const resourcesByType = resources[0];
    const result: SNSTopic[] = [];
    const snsTopicResources = resourcesByType[AWS_SNS_Topic];

    if (snsTopicResources === undefined || snsTopicResources.length === 0) {
        return result;
    }

    return snsTopicResources
        .map(resource => resource as AwsSNSTopic)
        .map(sns => {
            const name = sns.Properties.TopicName !== undefined && sns.Properties.TopicName.length > 0
                         ? sns.Properties.TopicName : sns.ID;
            let subs: { protocol: string, endpoint: string }[];

            if (sns.Properties.Subscription !== undefined && sns.Properties.Subscription.length > 0) {
                subs = sns.Properties.Subscription
                          .map(subscription => {
                              return {
                                  protocol: subscription.Protocol,
                                  endpoint: subscription.Endpoint,
                              };
                          });
            } else {
                subs = [];
            }

            resourcesByType[AWS_SNS_Subscription]
                .map(subscription => {
                    return subscription as AwsSNSSubscription;
                })
                .filter(subscription => {
                    return subscription.Properties.TopicArn.Ref == sns.ID;
                })
                .forEach(subscription => {
                    subs.push({
                                  endpoint: subscription.Properties.Endpoint,
                                  protocol: subscription.Properties.Protocol,

                              });
                });

            return {
                type: sns.Type,
                name: name,
                subscriptions: subs,
            };
        });
}