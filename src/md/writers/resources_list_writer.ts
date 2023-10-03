import { AllowedResource, createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree }                                                from "../models";

export const writeListOfResources: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
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
    for (let i = 0; i < resources.length; i++) {
        resources[i].forEach(res => allResources.push(res));
    }

    const HEADER_LINE: string[] = [
        "Type",
        "Name",
    ];
    const tableValues: string[][] = [];

    allResources.forEach(field => {
        tableValues.push([
                             field.type,
                             field.name,
                         ]);
    });

    const header = makeHeader("List of the main AWS Resources", MdHeader.HEADER_LEVEL_2);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
};