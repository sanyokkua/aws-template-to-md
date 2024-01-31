import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { mdMakeContentBlock, mdMakeTable }       from "../../utils";
import { CommonMappedResource }                  from "../../../mapping/models/mapped_common";

export const createAwsDiagramResourcesSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        return "";
    }

    const allResources = dataValue.getAllResources();
    if (isEmptyArray(allResources)) {
        return "";
    }

    return createMarkdownContent(dataValue);
};

function createMarkdownContent(resourcesTree: DocumentResourcesTree): string {
    const content: string = createResourceListContent(resourcesTree);

    return mdMakeContentBlock(content, "Main AWS Resources Overview (Diagram Representation)");
}

function createResourceListContent(resourcesList: DocumentResourcesTree): string {
    const finalResourcesList: CommonMappedResource[] = [];
    const allowedResources: CommonMappedResource[][] = [
        resourcesList.getMappedApiGatewayRestApi(),
        resourcesList.getMappedEventsEventBus(),
        resourcesList.getMappedEventsRule(),
        resourcesList.getMappedDynamoDbTable(),
        resourcesList.getMappedStepFunctionsStateMachine(),
        resourcesList.getMappedLambdaFunction(),
        resourcesList.getMappedS3Bucket(),
        resourcesList.getMappedSNSTopic(),
        resourcesList.getMappedSQSQueue(),
    ];

    for (const resourcesList of allowedResources) {
        for (const resource of resourcesList) {
            finalResourcesList.push(resource);
        }
    }

    const tableHeader: string[] = ["Type", "Name"];
    const tableValues: string[][] = [];

    finalResourcesList.forEach(field => {
        tableValues.push([field.type, field.name]);
    });

    return mdMakeTable(tableHeader, tableValues);
}