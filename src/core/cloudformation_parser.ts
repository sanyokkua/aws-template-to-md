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
import logger from "../logger";

export function parseCloudFormationTemplate(jsonTemplate: string, parsingConfiguration: ParsingConfiguration): string {
    logger.debug({jsonTemplate, parsingConfiguration}, "parseCloudFormationTemplate. passed arguments");
    if (isEmptyString(jsonTemplate)) {
        logger.debug({}, "parseCloudFormationTemplate. jsonTemplate is empty");
        throw new Error("Passed CloudFormation JSON template is empty string, check console for details");
    }
    if (parsingConfiguration === undefined || parsingConfiguration === null) {
        logger.debug({}, "parseCloudFormationTemplate. parsingConfiguration is null");
        throw new Error("ParsingConfiguration is not initialized, check console for details");
    }

    let parsedCloudFormationTemplateJson;
    let rawCloudFormationResourcesCollection;
    let mappedDocumentResourcesTree;

    try {
        parsedCloudFormationTemplateJson = parseCloudFormationTemplateJson(jsonTemplate);
        logger.debug(parsedCloudFormationTemplateJson, "parseCloudFormationTemplate. json template was parsed");
    } catch (e) {
        logger.error(e, "parseCloudFormationTemplate. Failed to parse jsonTemplate");
        throw new Error("Error occurred during parsing CloudFormation Json Template, check console for details");
    }

    try {
        rawCloudFormationResourcesCollection = createRawCloudFormationResourcesCollection(
            parsedCloudFormationTemplateJson);
        logger.debug(parsedCloudFormationTemplateJson,
                     "parseCloudFormationTemplate. rawCloudFormationResourcesCollection was created");
    } catch (e) {
        logger.error(e, "parseCloudFormationTemplate. Failed to create rawCloudFormationResourcesCollection");
        throw new Error(
            "Error occurred during creation of RawCloudFormationResourcesCollection, check console for details");
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
        logger.debug(parsingOptions, "parseCloudFormationTemplate. ParsingOptions was created");

        mappedDocumentResourcesTree = createDocumentResourcesTree(rawCloudFormationResourcesCollection, parsingOptions);
        logger.debug(mappedDocumentResourcesTree,
                     "parseCloudFormationTemplate. mappedDocumentResourcesTree was created");
    } catch (e) {
        logger.error(e, "parseCloudFormationTemplate. Failed to create mappedDocumentResourcesTree");
        throw new Error(
            "Error occurred during mapping of RawCloudFormationResourcesCollection to DocumentResourcesTree, check console for details");
    }

    const result: string = createMarkdownDocument(parsingConfiguration, mappedDocumentResourcesTree);
    logger.debug(result, "parseCloudFormationTemplate, result");
    return result;
}