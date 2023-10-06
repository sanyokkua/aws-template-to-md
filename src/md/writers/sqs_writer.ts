import {
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                          from "./common/common_md_functions";
import { DocumentResourcesTree, SQSQueue } from "../models/models";

function createSqsContent(sqsQueues: SQSQueue[]): string {
    const HEADER_LINE: string[] = [
        "Name",
        "Fifo",
        "Deduplication",
        "Delay (Sec)",
        "Retention Period (Sec)",
        "Visibility Timeout (Sec)",
    ];
    const tableValues: string[][] = [];

    sqsQueues.forEach(sqs => {
        tableValues.push([
                             sqs.name,
                             sqs.fifoQueue ? "Yes" : "No",
                             sqs.contentBasedDeduplication ? "Enabled" : "Disabled",
                             `${sqs.delaySeconds}`,
                             `${sqs.messageRetentionPeriod}`,
                             `${sqs.visibilityTimeout}`,
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

export const writeSqsQueues: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const sqsQueues = params.value.mappedSQSQueue;
    if (sqsQueues === undefined || sqsQueues.length === 0) {
        return "";
    }

    const content: string = createSqsContent(sqsQueues);
    return createContentBlock("AWS SQS Information", MdHeader.HEADER_LEVEL_2, content);
};