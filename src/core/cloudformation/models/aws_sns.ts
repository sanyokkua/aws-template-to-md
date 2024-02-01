import { CommonResource } from "./common_models";


// AWS::SNS::Subscription
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html
export interface AwsSNSSubscription extends CommonResource {
    "Properties": {
        "DeliveryPolicy": any,
        "Endpoint": string,
        "FilterPolicy": any,
        "FilterPolicyScope": string,
        "Protocol": string,
        "RawMessageDelivery": boolean,
        "RedrivePolicy": any,
        "Region": string,
        "SubscriptionRoleArn": string,
        "TopicArn": {
            "Ref": string
        }
    };
}

// AWS::SNS::Topic
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
export interface AwsSNSTopic extends CommonResource {
    "Properties": {
        "ContentBasedDeduplication": boolean,
        "DataProtectionPolicy": any,
        "DisplayName": string,
        "FifoTopic": boolean,
        "KmsMasterKeyId": string,
        "SignatureVersion": string,
        "Subscription": {
            "Endpoint": string,
            "Protocol": string
        }[],
        "Tags": {
            "Key": string,
            "Value": string
        }[],
        "TopicName": string,
        "TracingConfig": string
    };
}

// AWS::SNS::TopicPolicy
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicpolicy.html
export interface AwsSNSTopicPolicy extends CommonResource {
    "Properties": {
        "PolicyDocument": any,
        "Topics": string[]
    };
}
