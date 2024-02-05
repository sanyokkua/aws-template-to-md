import { CloudFormationTemplate, RawCloudFormationResourcesCollection } from "./models/common_models";
import { isEmptyString }                                                from "../string_utils";
import logger                                                           from "../../logger";


export function parseCloudFormationTemplateJson(jsonString: string | undefined | null): CloudFormationTemplate {
    if (isEmptyString(jsonString) || jsonString === undefined || jsonString === null) {
        logger.error(jsonString, "parseCloudFormationTemplateJson. jsonString is empty");
        throw new Error("Passed CloudFormationTemplate string is null or empty, check console for details");
    }

    try {
        const cloudForgeTemplate: CloudFormationTemplate = JSON.parse(jsonString);
        logger.info(cloudForgeTemplate, "parseCloudFormationTemplateJson. Parsed jsonString successfully");
        return cloudForgeTemplate;
    } catch (e) {
        logger.error(e, "parseCloudFormationTemplateJson. Failed to parse json string");
        throw e;
    }
}

export function createRawCloudFormationResourcesCollection(cloudFormationTemplate: CloudFormationTemplate): RawCloudFormationResourcesCollection {
    if (cloudFormationTemplate === undefined || cloudFormationTemplate === null) {
        logger.error({}, "createRawCloudFormationResourcesCollection. cloudFormationTemplate is null");
        throw new Error("Passed CloudFormationTemplate object is null or undefined, check console for details");
    }

    if (cloudFormationTemplate.Resources === undefined || cloudFormationTemplate.Resources === null) {
        logger.error({}, "createRawCloudFormationResourcesCollection. cloudFormationTemplate.Resources is null");
        throw new Error("Passed CloudFormationTemplate object doesn't have Resources Node, check console for details");
    }

    const resourcesMapped = new RawCloudFormationResourcesCollection();
    const resources = cloudFormationTemplate.Resources;

    for (const key in resources) {
        resourcesMapped.addResource(key, resources[key]);
    }

    logger.debug(resourcesMapped, "createRawCloudFormationResourcesCollection, resourcesMapped");
    logger.info({}, "RawCloudFormationResourcesCollection was created");
    return resourcesMapped;
}