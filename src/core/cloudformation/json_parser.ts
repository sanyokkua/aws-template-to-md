import { CloudFormationTemplate, RawCloudFormationResourcesCollection } from "./models/common_models";
import { isEmptyString }                                                from "../string_utils";


export function parseCloudFormationTemplateJson(jsonString: string | undefined | null): CloudFormationTemplate {
    if (isEmptyString(jsonString) || jsonString === undefined || jsonString === null) {
        throw new Error("Passed CloudFormationTemplate string is null or empty");
    }

    try {
        const cloudForgeTemplate: CloudFormationTemplate = JSON.parse(jsonString);
        console.log("Parsed jsonString successfully");
        return cloudForgeTemplate;
    } catch (e) {
        console.log("Error occurred during parsing of the json string", e);
        throw e;
    }
}

export function createRawCloudFormationResourcesCollection(cloudFormationTemplate: CloudFormationTemplate): RawCloudFormationResourcesCollection {
    if (cloudFormationTemplate === undefined || cloudFormationTemplate === null) {
        throw new Error("Passed CloudFormationTemplate object is null or undefined");
    }

    if (cloudFormationTemplate.Resources === undefined || cloudFormationTemplate.Resources === null) {
        throw new Error("Passed CloudFormationTemplate object doesn't have Resources Node");
    }

    const resourcesMapped = new RawCloudFormationResourcesCollection();
    const resources = cloudFormationTemplate.Resources;

    for (const key in resources) {
        resourcesMapped.addResource(key, resources[key]);
    }

    return resourcesMapped;
}