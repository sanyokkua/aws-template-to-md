import { ParsingConfiguration } from "./config/models";
import { isEmptyString }        from "./string_utils";
import {
    createRawCloudFormationResourcesCollection,
    parseCloudFormationTemplateJson,
}                               from "./cloudformation/json_parser";
import {
    createDocumentResourcesTree,
}                               from "./mapping/cloudformation_mapper";
import {
    ParsingOptions,
    REMOVE_PREFIX_IN_RESOURCE_NAME,
    REMOVE_SUFFIX_IN_RESOURCE_NAME,
    REPLACE_TEXT_IN_RESOURCE_NAME,
}                               from "./mapping/options/parsing_options";
import {
    createMarkdownDocument,
}                               from "./markdown/markdown_writer";

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
        const prefix: string = parsingConfiguration.parserConfig.prefixToRemove ?? "";
        const suffix: string = parsingConfiguration.parserConfig.suffixToRemove ?? "";
        const replaceOrigin: string = parsingConfiguration.parserConfig.replaceOriginalValue ?? "";
        const replaceNew: string = parsingConfiguration.parserConfig.replaceToValue ?? "";
        let replaceValue: string = "";
        if (!isEmptyString(replaceOrigin)) {
            replaceValue = `${replaceOrigin},${replaceNew}`;
        }
        const parsingOptions: ParsingOptions = {
            [REMOVE_PREFIX_IN_RESOURCE_NAME]: prefix,
            [REMOVE_SUFFIX_IN_RESOURCE_NAME]: suffix,
            [REPLACE_TEXT_IN_RESOURCE_NAME]: replaceValue,
        };

        mappedDocumentResourcesTree = createDocumentResourcesTree(rawCloudFormationResourcesCollection, parsingOptions);
    } catch (e) {
        console.error(e);
        throw new Error("Error occurred during mapping of RawCloudFormationResourcesCollection to DocumentResourcesTree");
    }

    const result: string = createMarkdownDocument(parsingConfiguration, mappedDocumentResourcesTree);

    console.log(mappedDocumentResourcesTree);
    console.log(result);
    return result;
}