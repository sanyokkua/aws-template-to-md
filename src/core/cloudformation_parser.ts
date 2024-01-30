import { ParsingConfiguration } from "./config/models";
import { isEmptyString }        from "./string_utils";
import {
    createRawCloudFormationResourcesCollection,
    parseCloudFormationTemplateJson,
}                               from "./cloudformation/json_parser";
import {
    createDocumentResourcesTree,
}                               from "./mapping/cloudformation_mapper";

export function parseCloudFormationTemplate(jsonTemplate: string, parsingConfiguration: ParsingConfiguration): string {
    if (isEmptyString(jsonTemplate)) {
        throw new Error("Passed CloudFormation JSON template is empty string");
    }
    if (parsingConfiguration === undefined || parsingConfiguration === null) {
        throw new Error("ParsingConfiguration is not initialized");
    }

    let parsedCloudFormationTemplateJson;
    let rawCloudFormationResourcesCollection;
    let mappedDocumentResourcesTree;

    try {
        parsedCloudFormationTemplateJson = parseCloudFormationTemplateJson(jsonTemplate);
    } catch (e) {
        console.error(e);
        throw new Error("Error occurred during parsing CloudFormation Json Template");
    }

    try {
        rawCloudFormationResourcesCollection = createRawCloudFormationResourcesCollection(
            parsedCloudFormationTemplateJson);
    } catch (e) {
        console.error(e);
        throw new Error("Error occurred during creation of RawCloudFormationResourcesCollection");
    }

    try {
        mappedDocumentResourcesTree = createDocumentResourcesTree(rawCloudFormationResourcesCollection);
    } catch (e) {
        console.error(e);
        throw new Error("Error occurred during mapping of RawCloudFormationResourcesCollection to DocumentResourcesTree");
    }

    console.log(mappedDocumentResourcesTree);
    // TODO: implement creation of Markdown Document
    return "# STUB for Parsed JsonTemplate";
}