import {
    AwsWriterFunction,
    createContentBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterOptions,
}                                          from "./common/common_md_functions";
import { DocumentResourcesTree, SNSTopic } from "../models/models";

function createTopicDescription(snsTopic: SNSTopic): string {
    const HEADER_LINE: string[] = ["Protocol", "Endpoint"];
    const tableValues: string[][] = [];

    snsTopic.subscriptions.forEach(sub => {
        tableValues.push([sub.protocol, sub.endpoint]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

function createSnsContent(snsTopics: SNSTopic[]): string {
    const resultText: string[] = [];

    snsTopics.forEach(topic => {
        const content: string = createTopicDescription(topic);
        resultText.push(createContentBlock(topic.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultText.join(NEW_LINE);
}

export const writeSnsTopics: AwsWriterFunction = (resourcesList: DocumentResourcesTree, options?: WriterOptions): string => {
    const snsTopics = resourcesList.mappedSNSTopic;
    if (snsTopics === undefined || snsTopics.length === 0) {
        return "";
    }

    const content: string = createSnsContent(snsTopics);
    return createContentBlock("AWS SNS Information", MdHeader.HEADER_LEVEL_2, content);
};