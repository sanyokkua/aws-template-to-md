import { AllowedResource, createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree }                                                from "../models";

type Amount = [number, string];


function addAmount(resourcesList: AllowedResource[], amounts: Amount[]) {
    if (resourcesList !== undefined && resourcesList.length > 0) {
        const amount = resourcesList.length;
        const typeOfResource: string = resourcesList[0].type;
        amounts.push([amount, typeOfResource]);
    }
}

export const writeAmountOfResources: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
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
        addAmount(resources[i], amounts);
    }

    const HEADER_LINE: string[] = [
        "Amount",
        "Resource Type",
    ];
    const tableValues: string[][] = [];

    amounts.forEach(field => {
        tableValues.push([
                             `${field[0]}`,
                             field[1],
                         ]);
    });

    const header = makeHeader("Amount of The Main AWS Resources", MdHeader.HEADER_LEVEL_2);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
};