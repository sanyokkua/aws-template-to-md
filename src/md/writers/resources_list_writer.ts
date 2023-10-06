import {
    AllowedResource,
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                from "./common/common_md_functions";
import { DocumentResourcesTree } from "../models/models";

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

export const writeListOfResources: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const content: string = createResourceListContent(params.value);
    return createContentBlock("List of the main AWS Resources", MdHeader.HEADER_LEVEL_2, content);
};