import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { CommonMappedResource }                  from "../../../mapping/models/mapped_common";
import { mdMakeContentBlock, mdMakeTable }       from "../../utils";

type Amount = [number, string];

export const createAwsAmountOfResourceSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        return "";
    }

    const allResources = dataValue.getAllResources();
    if (isEmptyArray(allResources)) {
        return "";
    }

    return createMarkdownContent(allResources);
};

function createMarkdownContent(allResources: CommonMappedResource[]): string {
    const content = createAmountMappingTable(allResources);

    return mdMakeContentBlock(content, "Amount of The AWS Resources in CloudFormation Template");
}


function createAmountMappingTable(allResources: CommonMappedResource[]): string {
    const amounts: Amount[] = createAmountMapping(allResources);

    const tableHeader: string[] = ["Amount", "Resource Type"];
    const tableValues: string[][] = [];

    amounts.forEach(([amount, type]) => {
        tableValues.push([
                             `${amount}`,
                             type,
                         ]);
    });

    return mdMakeTable(tableHeader, tableValues);
}

function createAmountMapping(allResources: CommonMappedResource[]): Amount[] {
    const amounts: Amount[] = [];
    const resourcesMapped: { [key: string]: CommonMappedResource[] } = {};

    for (const resource of allResources) {
        if (resourcesMapped[resource.type] === undefined || resourcesMapped[resource.type] === null) {
            resourcesMapped[resource.type] = [];
        }
        resourcesMapped[resource.type].push(resource);
    }

    for (let resourcesMappedKey in resourcesMapped) {
        const amount = resourcesMapped[resourcesMappedKey].length;
        const typeOfResource: string = resourcesMapped[resourcesMappedKey][0].type;
        amounts.push([amount, typeOfResource]);
    }

    return amounts.sort((a: Amount, b: Amount): number => {
        return a[1].localeCompare(b[1]);
    });
}
