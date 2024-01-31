import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import { AWS_SNS_SUBSCRIPTION, AWS_SNS_TOPIC }                  from "../../cloudformation/constants";
import { getFixedName, getStringValueForField }                 from "../utils/utils";
import { MappedSNSTopic, SnsTopicSubscription }                 from "../models/mapped_aws_sns";
import { AwsSNSSubscription, AwsSNSTopic }                      from "../../cloudformation/models/aws_sns";

export class MapperMappedSNSTopic implements Mapper<MappedSNSTopic> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedSNSTopic {
        basicResourceValidation(resource, AWS_SNS_TOPIC);

        const snsResource: AwsSNSTopic = resource as AwsSNSTopic;
        const snsResourceId: string = snsResource._ID;
        const snsResourceType: string = snsResource.Type;
        const snsResourceName: string = getFixedName(snsResource._Name, options);
        const snsTopicSubscriptions: SnsTopicSubscription[] = this.getResourceInternalSnsSubscriptions(snsResource);

        const snsSubscriptionsRelatedToTheCurrentTopic = this.getSnsSubscriptionsRelatedToTheCurrentTopic(
            rawResourcesCollection,
            snsResourceId);

        for (const subscription of snsSubscriptionsRelatedToTheCurrentTopic) {
            snsTopicSubscriptions.push({
                                           endpoint: subscription.Properties.Endpoint,
                                           protocol: subscription.Properties.Protocol,
                                       });
        }


        return {
            id: snsResourceId,
            type: snsResourceType,
            name: snsResourceName,
            subscriptions: snsTopicSubscriptions,
        };
    }

    private getResourceInternalSnsSubscriptions(snsResource: AwsSNSTopic) {
        const subscriptionsList = snsResource?.Properties?.Subscription ?? [];
        return subscriptionsList.map(subscription => {
            return {
                protocol: subscription.Protocol,
                endpoint: subscription.Endpoint,
            };
        });
    }

    private getSnsSubscriptionsRelatedToTheCurrentTopic(rawResourcesCollection: RawCloudFormationResourcesCollection, snsResourceId: string) {
        return rawResourcesCollection.getResourcesByType(AWS_SNS_SUBSCRIPTION)
                                     .map(subscription => {
                                         return subscription as AwsSNSSubscription;
                                     })
                                     .filter(subscription => {
                                         const subscriptionParentTopicId = getStringValueForField(subscription.Properties.TopicArn.Ref);
                                         return subscriptionParentTopicId == snsResourceId;
                                     });
    }
}