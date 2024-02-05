import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { MappedSQSQueue }                        from "../../../mapping/models/mapped_aws_sqs";
import { mdMakeContentBlock, mdMakeTable }       from "../../utils";
import logger                                    from "../../../../logger";


export const createAwsSqsSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsSqsSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const mappedSQSQueues = dataValue.getMappedSQSQueue();
    if (isEmptyArray(mappedSQSQueues)) {
        logger.debug({}, "createAwsSqsSectionText. mappedSQSQueues is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsSqsSectionText. input values");

    return createMarkdownContent(mappedSQSQueues);
};

function createMarkdownContent(mappedSQSQueues: MappedSQSQueue[]): string {
    const content: string = createSqsContentTable(mappedSQSQueues);

    return mdMakeContentBlock(content, "AWS SQS Information");
}


function createSqsContentTable(sqsQueues: MappedSQSQueue[]): string {
    const tableHeader: string[] = [
        "Name",
        "Fifo",
        "Deduplication",
        "Delay (Sec)",
        "Retention Period (Sec)",
        "Visibility Timeout (Sec)",
    ];
    const tableValues: string[][] = [];

    for (const sqs of sqsQueues) {
        tableValues.push([
                             sqs.name,
                             sqs.fifoQueue ? "Yes" : "No",
                             sqs.contentBasedDeduplication ? "Enabled" : "Disabled",
                             `${sqs.delaySeconds}`,
                             `${sqs.messageRetentionPeriod}`,
                             `${sqs.visibilityTimeout}`,
                         ]);
    }

    return mdMakeTable(tableHeader, tableValues);
}