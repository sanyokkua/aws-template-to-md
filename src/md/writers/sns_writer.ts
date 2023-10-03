import { createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree, SNSTopic }                     from "../models";

function createTopicDescription(snsTopic: SNSTopic): string {
    const HEADER_LINE: string[] = [
        "Protocol",
        "Endpoint",
    ];
    const tableValues: string[][] = [];

    snsTopic.subscriptions.forEach(sub => {
        tableValues.push([
                             sub.protocol,
                             sub.endpoint,
                         ]);
    });

    const header = makeHeader("Subscriptions:", MdHeader.HEADER_LEVEL_4);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
}

export const writeSnsTopics: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const snsTopics = resourcesList.mappedSNSTopic;
    if (snsTopics === undefined || snsTopics.length === 0) {
        return "";
    }

    const resultText: string[] = [];
    const header = makeHeader("AWS SNS Information", MdHeader.HEADER_LEVEL_2);
    resultText.push(header);


    for (let i = 0; i < snsTopics.length; i++) {
        resultText.push(makeHeader(snsTopics[i].name, MdHeader.HEADER_LEVEL_3));
        resultText.push(createTopicDescription(snsTopics[i]));
    }

    return resultText.join("\n");
};