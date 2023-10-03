import { AllowedResource, createContentBlock, createMdTable, MdHeader, WriterFunction } from "./common/common";
import { DocumentResourcesTree }                                                        from "../models";

function createResourceListContent(resourcesList: DocumentResourcesTree): string {
    const allResources: AllowedResource[] = [];
    const resources: AllowedResource[][] = [
        resourcesList.mappedApiGatewayRestApi,
        resourcesList.mappedEventsEventBus,
        resourcesList.mappedEventsRule,
        resourcesList.mappedDynamoDbTable,
        resourcesList.mappedStepFunctionsStateMachine,
        resourcesList.mappedLambdaFunction,
        resourcesList.mappedS3Bucket,
        resourcesList.mappedSNSTopic,
        resourcesList.mappedSQSQueue,
    ];

    resources.forEach(allowedResources => {
        allowedResources.forEach(resource => allResources.push(resource));
    });

    const HEADER_LINE: string[] = ["Type", "Name"];
    const tableValues: string[][] = [];

    allResources.forEach(field => {
        tableValues.push([field.type, field.name]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

export const writeListOfResources: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const content: string = createResourceListContent(resourcesList);
    return createContentBlock("List of the main AWS Resources", MdHeader.HEADER_LEVEL_2, content);
};