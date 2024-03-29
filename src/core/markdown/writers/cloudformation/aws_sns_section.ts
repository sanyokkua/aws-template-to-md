import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { MappedSNSTopic }                        from "../../../mapping/models/mapped_aws_sns";
import { mdMakeContentBlock, mdMakeTable }       from "../../utils";
import { MDHeader, NEW_LINE }                    from "../../constants";
import logger                                    from "../../../../logger";


export const createAwsSnsSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsSnsSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const mappedSNSTopics = dataValue.getMappedSNSTopic();
    if (isEmptyArray(mappedSNSTopics)) {
        logger.debug({}, "createAwsSnsSectionText. mappedSNSTopics is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsSnsSectionText. input values");

    return createMarkdownContent(mappedSNSTopics);
};

function createMarkdownContent(mappedSNSTopics: MappedSNSTopic[]): string {
    const content: string = createSnsTopicsContentBlocks(mappedSNSTopics);

    return mdMakeContentBlock(content, "AWS SNS Information");
}

function createSnsTopicsContentBlocks(snsTopics: MappedSNSTopic[]): string {
    const snsTopicInformationBlocks: string[] = [];

    for (const topic of snsTopics) {
        const subscriptionsTable: string = createSnsTopicsSubscriptionsTable(topic);
        const snsTopicInformationBlock = mdMakeContentBlock(subscriptionsTable, topic.name, MDHeader.HEADER_LEVEL_3);
        snsTopicInformationBlocks.push(snsTopicInformationBlock);
    }

    return snsTopicInformationBlocks.join(NEW_LINE);
}

function createSnsTopicsSubscriptionsTable(snsTopic: MappedSNSTopic): string {
    const tableHeader: string[] = ["Protocol", "Endpoint"];
    const tableValues: string[][] = [];

    for (const sub of snsTopic.subscriptions) {
        tableValues.push([sub.protocol, sub.endpoint]);
    }

    return mdMakeTable(tableHeader, tableValues);
}
