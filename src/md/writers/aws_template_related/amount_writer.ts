import {
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                from "../common/common_md_functions";
import { CommonResource, DocumentResourcesTree } from "../../mapper/models/models";

type Amount = [number, string];

function createAmountMapping(resourcesList: DocumentResourcesTree) {
    const amounts: Amount[] = [];
    const resourcesMapped: { [key: string]: CommonResource[] } = {};

    resourcesList.mappedAllResources.forEach(value => {
        if (resourcesMapped[value.type] === undefined || resourcesMapped[value.type] === null) {
            resourcesMapped[value.type] = [];
        }
        resourcesMapped[value.type].push(value);
    });

    for (let resourcesMappedKey in resourcesMapped) {
        const amount = resourcesMapped[resourcesMappedKey].length;
        const typeOfResource: string = resourcesMapped[resourcesMappedKey][0].type;
        amounts.push([amount, typeOfResource]);
    }

    return amounts.sort((a: Amount, b: Amount): number => {
        return a[1].localeCompare(b[1]);
    });
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

export const writeAmountOfResources: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const content = createContent(params.value);
    return createContentBlock("Amount of The AWS Resources in CloudFormation Template",
                              MdHeader.HEADER_LEVEL_2,
                              content);
};