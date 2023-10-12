import {
    createCollapsableSection,
    createContentBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                               from "../common/common_md_functions";
import { DocumentResourcesTree, DynamoDbTable } from "../../mapper/models/models";

function createDynamoDbStructureDescription(dynamoDbTable: DynamoDbTable): string {
    const HEADER_LINE: string[] = [
        "Field Name",
        "Value Type",
        "Key Type",
        "Local Secondary Indexes",
        "Global Secondary Indexes",
        "Key Role",
    ];
    const tableValues: string[][] = dynamoDbTable.structure.fields
                                                 .map(field => [
                                                     field.name,
                                                     field.type,
                                                     field.keyType,
                                                     field.localIndexes.join(","),
                                                     field.globalIndexes.join(","),
                                                     field.keyRole,
                                                 ]);
    return createMdTable(HEADER_LINE, tableValues);
}

function createDynamoDbTextContent(dynamoDbTables: DynamoDbTable[], options?: WriterOptions): string {
    const resultText: string[] = [];

    dynamoDbTables.forEach(dynamoDb => {
        const content: string[] = [];
        content.push(createDynamoDbStructureDescription(dynamoDb));

        if (options !== undefined && "CREATE_DATA_EXAMPLE_STUB" in options) {
            if (options["CREATE_DATA_EXAMPLE_STUB"] === true) {
                content.push(createCollapsableSection("Data Example", "TODO:"));
            }
        }

        resultText.push(createContentBlock(`${dynamoDb.name} - Keys`, MdHeader.HEADER_LEVEL_3, content.join(NEW_LINE)));
    });

    return resultText.join(NEW_LINE);
}

export const writeDynamoDbTables: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const dynamoDbTables = params.value.mappedDynamoDbTable;
    if (dynamoDbTables === undefined || dynamoDbTables.length === 0) {
        return "";
    }

    const content: string = createDynamoDbTextContent(dynamoDbTables, options);
    return createContentBlock("AWS DynamoDB Information", MdHeader.HEADER_LEVEL_2, content);
};