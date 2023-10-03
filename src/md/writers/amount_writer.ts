import { AllowedResource, createContentBlock, createMdTable, MdHeader, WriterFunction } from "./common/common";
import { DocumentResourcesTree }                                                        from "../models";

type Amount = [number, string];

function createAmountMapping(resourcesList: DocumentResourcesTree) {
    const amounts: Amount[] = [];
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
        if (resources[i] !== undefined && resources[i].length > 0) {
            const amount = resources[i].length;
            const typeOfResource: string = resources[i][0].type;
            amounts.push([amount, typeOfResource]);
        }
    }

    return amounts;
}

function createContent(resourcesList: DocumentResourcesTree) {
    const amounts: Amount[] = createAmountMapping(resourcesList);

    const HEADER_LINE: string[] = ["Amount", "Resource Type"];
    const tableValues: string[][] = [];

    amounts.forEach(row => {
        tableValues.push([
                             `${row[0]}`,
                             row[1],
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

export const writeAmountOfResources: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const content = createContent(resourcesList);
    return createContentBlock("Amount of The Main AWS Resources", MdHeader.HEADER_LEVEL_2, content);
};