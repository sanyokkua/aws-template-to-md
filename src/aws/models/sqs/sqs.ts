/*
AWS::SQS::Queue
AWS::SQS::QueuePolicy
* */

import { CommonResourceInfo } from "../common";

export interface AwsSQSQueue extends CommonResourceInfo {
    "Properties": {
        "ContentBasedDeduplication": boolean,
        "DeduplicationScope": string,
        "DelaySeconds": number,
        "FifoQueue": boolean,
        "FifoThroughputLimit": string,
        "KmsDataKeyReusePeriodSeconds": number,
        "KmsMasterKeyId": string,
        "MaximumMessageSize": number,
        "MessageRetentionPeriod": number,
        "QueueName": string,
        "ReceiveMessageWaitTimeSeconds": number,
        "RedriveAllowPolicy": any,
        "RedrivePolicy": any,
        "SqsManagedSseEnabled": boolean,
        "Tags": {
            "Key": string,
            "Value": string
        }[],
        "VisibilityTimeout": number
    };
    "UpdateReplacePolicy": string,
    "DeletionPolicy": string,
}

export interface AwsSQSQueuePolicy extends CommonResourceInfo {
    "Properties": {
        "PolicyDocument": any,
        "Queues": string | any[]
    };
}