import { createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree, DynamoDbTable }                from "../models";

function createDynamoDbStructureDescription(dynamoDbTable: DynamoDbTable) {
    const HEADER_LINE: string[] = [
        "Field Name",
        "Type",
        "Key/SortKey",
    ];
    const tableValues: string[][] = [];

    dynamoDbTable.structure.keys.forEach(field => {
        tableValues.push([
                             field.name,
                             field.type,
                             "Yes",
                         ]);
    });
    dynamoDbTable.structure.attributes.forEach(field => {
        tableValues.push([
                             field.name,
                             field.type,
                             "No",
                         ]);
    });

    const header = makeHeader("Structure of DynamoDB Table:", MdHeader.HEADER_LEVEL_4);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
}

export const writeDynamoDbTables: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const dynamoDbTables = resourcesList.mappedDynamoDbTable;
    if (dynamoDbTables === undefined || dynamoDbTables.length === 0) {
        return "";
    }
    const resultText: string[] = [];
    const header = makeHeader("AWS DynamoDB Information", MdHeader.HEADER_LEVEL_2);
    resultText.push(header);


    for (let i = 0; i < dynamoDbTables.length; i++) {
        resultText.push(makeHeader(dynamoDbTables[i].name, MdHeader.HEADER_LEVEL_3));
        resultText.push(createDynamoDbStructureDescription(dynamoDbTables[i]));
    }

    return resultText.join("\n");
};