import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { SQSQueue }                                   from "../models";
import { AWS_SQS_Queue }                              from "../../aws/constants";
import { AwsSQSQueue }                                from "../../aws/models/sqs/sqs";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-delayseconds
const AWS_SQS_DELAY_SECONDS_DEFAULT: number = 0;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-messageretentionperiod
const AWS_SQS_MSG_RETENTION_PERIOD_DEFAULT: number = 345600; // Seconds
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-visibilitytimeout
const AWS_SQS_VISIBILITY_TIMEOUT_DEFAULT: number = 30;

export function getMappedSQSQueue(resources: [ResourcesMappedByType, ResourcesMappedById]): SQSQueue[] {
    const resourcesByType = resources[0];
    const result: SQSQueue[] = [];
    const sqsResources = resourcesByType[AWS_SQS_Queue];

    if (sqsResources === undefined || sqsResources.length === 0) {
        return result;
    }

    return sqsResources
        .map(resource => resource as AwsSQSQueue)
        .map(sqs => {
            const name = sqs.Name !== undefined && sqs.Name.length > 0
                         ? sqs.Name : sqs.ID;
            const contentBasedDeduplication = sqs.Properties.ContentBasedDeduplication !== undefined
                                              ? sqs.Properties.ContentBasedDeduplication : false;
            const fifoQueue = sqs.Properties.FifoQueue !== undefined
                              ? sqs.Properties.FifoQueue : false;
            const delaySeconds = sqs.Properties.DelaySeconds !== undefined
                                 ? sqs.Properties.DelaySeconds : AWS_SQS_DELAY_SECONDS_DEFAULT;
            const messageRetentionPeriod = sqs.Properties.MessageRetentionPeriod != undefined
                                           ?
                                           sqs.Properties.MessageRetentionPeriod :
                                           AWS_SQS_MSG_RETENTION_PERIOD_DEFAULT;
            const visibilityTimeout = sqs.Properties.VisibilityTimeout != undefined
                                      ? sqs.Properties.VisibilityTimeout : AWS_SQS_VISIBILITY_TIMEOUT_DEFAULT;

            return {
                type: sqs.Type,
                name: name,
                contentBasedDeduplication: contentBasedDeduplication,
                fifoQueue: fifoQueue,
                delaySeconds: delaySeconds,
                messageRetentionPeriod: messageRetentionPeriod,
                visibilityTimeout: visibilityTimeout,
                updateReplacePolicy: sqs.UpdateReplacePolicy,
                deletionPolicy: sqs.DeletionPolicy,
            };
        });
}