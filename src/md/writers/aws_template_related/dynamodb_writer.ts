import {
    createContentBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                               from "../common/common_md_functions";
import { DocumentResourcesTree, DynamoDbTable } from "../../models/models";

type DynamoDbItem = {
    name: string;
    type: string;
    isKey: boolean;
    keyType: string;
}

function createDynamoDbStructureDescription(dynamoDbTable: DynamoDbTable) {
    const HEADER_LINE: string[] = ["Field Name", "Type", "Is Key/SortKey", "Key Type"];
    const tableValues: string[][] = [];

    const attributes: DynamoDbItem[] = dynamoDbTable.structure.attributes.map(attr => {
        const attName: string = attr.name;
        const attType: string = attr.type;
        const foundKey = dynamoDbTable.structure.keys.find(keyName => keyName.name === attName);
        const attIsKey: boolean = foundKey !== undefined;
        const attKeyType: string = foundKey !== undefined ? foundKey.type : "";
        return {
            name: attName,
            type: attType,
            isKey: attIsKey,
            keyType: attKeyType,
        };
    });

    attributes.forEach(attribute => {
        tableValues.push([
                             attribute.name,
                             attribute.type,
                             attribute.isKey ? "Yes" : "No",
                             attribute.keyType,
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

function createDynamoDbTextContent(dynamoDbTables: DynamoDbTable[]): string {
    const resultText: string[] = [];

    dynamoDbTables.forEach(dynamoDb => {
        const content = createDynamoDbStructureDescription(dynamoDb);
        resultText.push(createContentBlock(dynamoDb.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultText.join(NEW_LINE);
}

export const writeDynamoDbTables: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const dynamoDbTables = params.value.mappedDynamoDbTable;
    if (dynamoDbTables === undefined || dynamoDbTables.length === 0) {
        return "";
    }

    const content: string = createDynamoDbTextContent(dynamoDbTables);
    return createContentBlock("AWS DynamoDB Information", MdHeader.HEADER_LEVEL_2, content);
};