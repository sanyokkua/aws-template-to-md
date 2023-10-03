/*
AWS::SNS::Subscription
AWS::SNS::Topic
AWS::SNS::TopicPolicy
* */

import { CommonResourceInfo } from "../common";

export interface AwsSNSSubscription extends CommonResourceInfo {
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

export interface AwsSNSTopic extends CommonResourceInfo {
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

export interface AwsSNSTopicPolicy extends CommonResourceInfo {
    "Properties": {
        "PolicyDocument": any,
        "Topics": string[]
    };
}
