import { AdditionalConfigs, MarkdownWriterFunc }                     from "../common";
import { DocumentResourcesTree }                                     from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                                              from "../../../common_utils";
import { DEFAULT_OTHER_APP_CONFIGURATION }                           from "../../../config/constatns";
import { MappedDynamoDbTable }                                       from "../../../mapping/models/mapped_aws_dynamodb";
import { MDHeader, NEW_LINE }                                        from "../../constants";
import { mdMakeCollapsableSection, mdMakeContentBlock, mdMakeTable } from "../../utils";

export const ADD_DYNAMO_DB_EXAMPLES_STUB = "addDynamoDbExamplesStub";

type Configuration = {
    addDynamoDbExamplesStub: boolean;
}

export const createAwsDynamoDBsSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        return "";
    }

    const dynamoDbTables = dataValue.getMappedDynamoDbTable();
    if (isEmptyArray(dynamoDbTables)) {
        return "";
    }

    let addDynamoDbExamplesStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addDynamoDbExamplesStub;

    if (additionalConfigs !== undefined) {
        addDynamoDbExamplesStub = additionalConfigs[ADD_DYNAMO_DB_EXAMPLES_STUB] ?? addDynamoDbExamplesStub;
    }

    const configuration: Configuration = {
        addDynamoDbExamplesStub,
    };

    return createMarkdownContent(dynamoDbTables, configuration);
};

function createMarkdownContent(dynamoDbTables: MappedDynamoDbTable[], configuration: Configuration): string {
    const restApisDescriptions: string[] = dynamoDbTables
        .map(dynamoDbTable => createDynamoDbMarkdownDescription(dynamoDbTable, configuration));
    const content = restApisDescriptions.join(NEW_LINE);
    return mdMakeContentBlock(content, "AWS DynamoDB Information");
}

function createDynamoDbMarkdownDescription(dynamoDbTable: MappedDynamoDbTable, configuration: Configuration): string {
    const content: string[] = [];
    content.push(createDynamoDbStructureDescription(dynamoDbTable));

    if (configuration.addDynamoDbExamplesStub) {
        content.push(mdMakeCollapsableSection("TODO:", "Record Example"));
    }

    return mdMakeContentBlock(content.join(NEW_LINE), `${dynamoDbTable.name} - Keys`, MDHeader.HEADER_LEVEL_3);
}

function createDynamoDbStructureDescription(dynamoDbTable: MappedDynamoDbTable): string {
    const headerLine: string[] = [
        "Field Name",
        "Value Type",
        "Key Type",
        "Local Secondary Indexes",
        "Global Secondary Indexes",
        "Key Role",
    ];
    const tableValues: string[][] = dynamoDbTable.fields
                                                 .map(field => [
                                                     field.name,
                                                     field.type,
                                                     field.keyType,
                                                     field.localIndexes.join(","),
                                                     field.globalIndexes.join(","),
                                                     field.keyRole,
                                                 ]);
    return mdMakeTable(headerLine, tableValues);
}