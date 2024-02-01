import { FnGetAtt, FnJoin, Ref, StringType }                           from "../../cloudformation/models/common_models";
import { AWS_PSEUDO_PARAMS_MAPPING }                                   from "../../cloudformation/constants";
import {
    ParsingOptions,
    REMOVE_PREFIX_IN_RESOURCE_NAME,
    REMOVE_SUFFIX_IN_RESOURCE_NAME,
    REPLACE_TEXT_IN_RESOURCE_NAME,
}                                                                      from "../options/parsing_options";
import { isEmptyString, removePrefix, removeSuffix, replaceSubstring } from "../../string_utils";
import logger from "../../../logger";

export function getStringValueForField(field: StringType | undefined): string {
    if (field === undefined) {
        logger.debug(field, "getStringValueForField. passed field is null, empty string will be returned");
        return "";
    }
    if (typeof field === "string") {
        logger.debug(field, "getStringValueForField. passed field is string and will be returned");
        return field;
    }
    if (typeof field === "object") {
        logger.debug(field, "getStringValueForField. passed field is object");
        if ("Ref" in field) {
            logger.debug(field, "getStringValueForField. passed field is object that has Red field");
            return getRefValue(field);
        } else if ("Fn::GetAtt" in field) {
            logger.debug(field, "getStringValueForField. passed field is object that has Fn::GetAtt field");
            return getFnGetAttIdValue(field);
        } else if ("Fn::Join" in field) {
            logger.debug(field, "getStringValueForField. passed field is object that has Fn::Join field");
            return getFnJoinValue(field);
        } else {
            logger.error(field, "getStringValueForField. passed field is object that doesn't have appropriate fields");
            throw new Error("Object doesn't have appropriate fields");
        }
    }
    logger.error(field, "getStringValueForField. passed field doesn't have appropriate type");
    throw new Error("This method shouldn't go here"); // debug assertion purpose
}

export function getRefValue(field: Ref): string {
    logger.debug(field, "getRefValue. passed field value");
    if ("Ref" in field && field.Ref !== undefined) {
        logger.debug(field, "getRefValue. passed field value has Ref inside");
        if (field.Ref in AWS_PSEUDO_PARAMS_MAPPING) {
            logger.debug(field,
                         "getRefValue. passed field value has Ref inside and has default value that will be returned");
            return AWS_PSEUDO_PARAMS_MAPPING[field.Ref];
        }
        logger.debug(field, "getRefValue. passed field value has Ref inside and its value will be returned");
        return field.Ref;
    }
    logger.warn(field, "getRefValue. Ref value is not found, empty string will be returned");
    return "";
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
// { "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] } => logicalNameOfResource.attributeName
// As result LogicalID is always first attribute
export function getFnGetAttIdValue(fnGetAttNode: FnGetAtt): string {
    logger.debug(fnGetAttNode, "getFnGetAttIdValue. passed field to function");
    if (fnGetAttNode === undefined || fnGetAttNode === null) {
        logger.debug(fnGetAttNode, "getFnGetAttIdValue. passed field to function is null");
        throw new Error("Passed fnGetAttNode is undefined or null");
    }
    if (!("Fn::GetAtt" in fnGetAttNode)) {
        logger.debug(fnGetAttNode, "getFnGetAttIdValue. passed field doesn't have Fn::GetAtt field inside");
        throw new Error("Fn::GetAtt node is not found in the passed object");
    }
    const resourceId: string | undefined = fnGetAttNode["Fn::GetAtt"][0];
    if (resourceId) {
        logger.debug(fnGetAttNode,
                     "getFnGetAttIdValue. passed field have Fn::GetAtt field inside and it's value will be returned");
        return resourceId;
    }

    logger.warn(fnGetAttNode, "getFnGetAttIdValue. value is not found, empty string will be returned");
    return "";
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
// { "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] }
export function getFnJoinValue(fnJoinNode: FnJoin): string {
    logger.debug(fnJoinNode, "getFnJoinValue. passed field value");
    if (fnJoinNode === undefined || fnJoinNode === null) {
        logger.debug(fnJoinNode, "getFnJoinValue. passed field value is null");
        throw new Error("Passed fnJoinNode is undefined or null");
    }
    if (!("Fn::Join" in fnJoinNode)) {
        logger.debug(fnJoinNode, "getFnJoinValue. passed field value doesn't have Fn::Join inside");
        throw new Error("Fn::Join node is not found in the passed object");
    }
    if (!Array.isArray(fnJoinNode["Fn::Join"]) || fnJoinNode["Fn::Join"].length !== 2) {
        logger.debug(fnJoinNode,
                     "getFnJoinValue. passed field value has Fn::Join inside, but it is not standard array");
        throw new Error(`Fn::Join should be array with length of 2 elements`);
    }

    const delimiter = fnJoinNode["Fn::Join"][0];
    logger.debug(delimiter, "getFnJoinValue. delimiter of Fn::Join");

    if (delimiter === undefined || delimiter === null || typeof delimiter !== "string") {
        logger.debug(delimiter, "getFnJoinValue. delimiter of Fn::Join is not a valid value");
        throw new Error("Delimiter is not valid");
    }

    const restOfTheElements = fnJoinNode["Fn::Join"].slice(1);
    logger.debug(restOfTheElements, "getFnJoinValue. restOfTheElements");

    if (restOfTheElements.length !== 1 || !Array.isArray(restOfTheElements[0])) {
        logger.debug(restOfTheElements, "getFnJoinValue. restOfTheElements, after slicing delimiter is not valid");
        throw new Error("Fn:Join after slicing delimiter is not valid");
    }

    const stringsToJoin: string[] = [];
    restOfTheElements[0].forEach(obj => {
        if (typeof obj === "string") {
            logger.debug(obj, "getFnJoinValue. restOfTheElements[0] forEach, type is string");
            stringsToJoin.push(obj);
        } else if ("Ref" in obj) {
            logger.debug(obj, "getFnJoinValue. restOfTheElements[0] forEach, type is Ref, getRef");
            const refValue = getRefValue(obj);
            stringsToJoin.push(refValue);
        } else if ("Fn::GetAtt" in obj) {
            logger.debug(obj, "getFnJoinValue. restOfTheElements[0] forEach, type is Fn::GetAtt, getFnGetAttIdValue");
            const getAttValue = getFnGetAttIdValue(obj);
            stringsToJoin.push(getAttValue);
        } else {
            logger.debug(obj, "getFnJoinValue. restOfTheElements[0] forEach, type is unsupported");
            throw new Error("Invalid object type");
        }
    });
    const joinedResult = stringsToJoin
        .map(str => str.trim())
        .filter(str => str.length > 0)
        .join(delimiter);
    logger.debug(joinedResult, "getFnJoinValue, result value");
    return joinedResult;
}

export function getFixedName(originalName: string | undefined, options?: ParsingOptions) {
    logger.debug({originalName, options}, "getFixedName. Passed values");
    if (originalName === undefined || originalName === null) {
        logger.debug({originalName, options},
                     "getFixedName. Passed originalName is null, empty string will be returned");
        return "";
    }
    if (options === undefined) {
        logger.debug({originalName, options},
                     "getFixedName. Passed options is null, originalName will be trimmed and returned");
        return originalName.trim();
    }

    let removePrefixValue: string = options[REMOVE_PREFIX_IN_RESOURCE_NAME];
    let removeSuffixValue: string = options[REMOVE_SUFFIX_IN_RESOURCE_NAME];
    let replaceTextValue: string = options[REPLACE_TEXT_IN_RESOURCE_NAME]; //String in format - OldValue,NewValue

    let result = originalName.trim();
    if (removePrefixValue !== undefined && !isEmptyString(removePrefixValue)) {
        result = removePrefix(result, removePrefixValue);
        logger.debug(result, "getFixedName. Prefix is removed");
    }
    if (removeSuffixValue !== undefined && !isEmptyString(removeSuffixValue)) {
        result = removeSuffix(result, removeSuffixValue);
        logger.debug(result, "getFixedName. Suffix is removed");
    }
    if (replaceTextValue !== undefined && !isEmptyString(replaceTextValue) && replaceTextValue.includes(",")) {
        logger.debug(replaceTextValue, "getFixedName. replace original value");
        const replaceValues = replaceTextValue.split(",");
        if (replaceValues.length !== 2) {
            logger.debug(result, "getFixedName. replace failed, expected 2 elements in the string");
            throw new Error(`More than 2 elements in the replaceTextValue string, ${JSON.stringify(replaceValues)}`);
        }
        const [oldValue, newValue] = replaceValues;
        result = replaceSubstring(result, oldValue, newValue);
        logger.debug(result, "getFixedName. value after replacing value");
    }

    logger.debug({}, `Original name was: ${originalName}, result name: ${result}`);
    return result;
}