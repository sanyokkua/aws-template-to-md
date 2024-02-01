import { CommonResource } from "./common_models";


// AWS::SQS::Queue
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html
export interface AwsSQSQueue extends CommonResource {
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

// AWS::SQS::QueuePolicy
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queuepolicy.html
export interface AwsSQSQueuePolicy extends CommonResource {
    "Properties": {
        "PolicyDocument": any,
        "Queues": string | any[]
    };
}