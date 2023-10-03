import { createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree }                               from "../models";

export const writeSqsQueues: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const sqsQueues = resourcesList.mappedSQSQueue;
    if (sqsQueues === undefined || sqsQueues.length === 0) {
        return "";
    }

    const HEADER_LINE: string[] = [
        "Name",
        "Fifo",
        "Deduplication",
        "Delay",
        "Retention Period",
        "Visibility Timeout",
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

    const header = makeHeader("AWS SQS Information", MdHeader.HEADER_LEVEL_2);

    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
};