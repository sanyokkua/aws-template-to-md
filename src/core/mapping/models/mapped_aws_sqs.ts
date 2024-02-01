import { CommonMappedResource } from "./mapped_common";

export interface MappedSQSQueue extends CommonMappedResource {
    contentBasedDeduplication: boolean; // AwsSQSQueue.Properties.ContentBasedDeduplication
    fifoQueue: boolean; // AwsSQSQueue.Properties.FifoQueue
    delaySeconds: number; // AwsSQSQueue.Properties.DelaySeconds
    messageRetentionPeriod: number; // AwsSQSQueue.Properties.MessageRetentionPeriod
    visibilityTimeout: number; // AwsSQSQueue.Properties.VisibilityTimeout
}