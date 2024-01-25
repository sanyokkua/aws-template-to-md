import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import { AWS_SQS_QUEUE }                                        from "../../cloudformation/constants";
import { getFixedName }                                         from "../utils/utils";
import { MappedSQSQueue }                                       from "../models/mapped_aws_sqs";
import { AwsSQSQueue }                                          from "../../cloudformation/models/aws_sqs";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-delayseconds
const AWS_SQS_DELAY_SECONDS_DEFAULT: number = 0;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-messageretentionperiod
const AWS_SQS_MSG_RETENTION_PERIOD_DEFAULT: number = 345600; // Seconds
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-visibilitytimeout
const AWS_SQS_VISIBILITY_TIMEOUT_DEFAULT: number = 30;
const AWS_SQS_FIFO_DEFAULT: boolean = false;
const AWS_SQS_CONTENT_DEDUPLICATION_DEFAULT: boolean = false;

export class MapperMappedSQSQueue implements Mapper<MappedSQSQueue> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedSQSQueue {
        basicResourceValidation(resource, AWS_SQS_QUEUE);

        const sqsResource: AwsSQSQueue = resource as AwsSQSQueue;
        const sqsResourceId: string = sqsResource._ID;
        const sqsResourceType: string = sqsResource.Type;
        const sqsResourceName: string = getFixedName(sqsResource._Name, options);

        const sqsContentBasedDeduplication = sqsResource?.Properties?.ContentBasedDeduplication ?? AWS_SQS_CONTENT_DEDUPLICATION_DEFAULT;
        const sqsFifoQueue = sqsResource?.Properties?.FifoQueue ?? AWS_SQS_FIFO_DEFAULT;
        const sqsDelaySeconds = sqsResource?.Properties?.DelaySeconds ?? AWS_SQS_DELAY_SECONDS_DEFAULT;
        const sqsMessageRetentionPeriod = sqsResource?.Properties?.MessageRetentionPeriod ?? AWS_SQS_MSG_RETENTION_PERIOD_DEFAULT;
        const sqsVisibilityTimeout = sqsResource?.Properties?.VisibilityTimeout ?? AWS_SQS_VISIBILITY_TIMEOUT_DEFAULT;

        return {
            id: sqsResourceId,
            type: sqsResourceType,
            name: sqsResourceName,
            contentBasedDeduplication: sqsContentBasedDeduplication,
            fifoQueue: sqsFifoQueue,
            delaySeconds: sqsDelaySeconds,
            messageRetentionPeriod: sqsMessageRetentionPeriod,
            visibilityTimeout: sqsVisibilityTimeout,
        };
    }
}