import { FnGetAtt, FnJoin, Ref, StringType }                           from "../../cloudformation/models/common_models";
import { AWS_PSEUDO_PARAMS_MAPPING }                                   from "../../cloudformation/constants";
import {
    ParsingOptions,
    REMOVE_PREFIX_IN_RESOURCE_NAME,
    REMOVE_SUFFIX_IN_RESOURCE_NAME,
    REPLACE_TEXT_IN_RESOURCE_NAME,
}                                                                      from "../options/parsing_options";
import { isEmptyString, removePrefix, removeSuffix, replaceSubstring } from "../../string_utils";

export function getStringValueForField(field: StringType | undefined): string {
    if (field === undefined) {
        return "";
    }
    if (typeof field === "string") {
        return field;
    }
    if (typeof field === "object") {
        if ("Ref" in field) {
            return getRefValue(field);
        } else if ("Fn::GetAtt" in field) {
            return getFnGetAttIdValue(field);
        } else if ("Fn::Join" in field) {
            return getFnJoinValue(field);
        } else {
            throw new Error("Object doesn't have appropriate fields");
        }
    }

    throw new Error("This method shouldn't go here"); // TODO: debug purpose
}

export function getRefValue(field: Ref): string {
    if ("Ref" in field && field.Ref !== undefined) {
        if (field.Ref in AWS_PSEUDO_PARAMS_MAPPING) {
            return AWS_PSEUDO_PARAMS_MAPPING[field.Ref];
        }
        return field.Ref;
    }
    console.warn("Ref value is not found, empty string will be returned");
    return "";
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
// { "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] } => logicalNameOfResource.attributeName
// As result LogicalID is always first attribute
export function getFnGetAttIdValue(fnGetAttNode: FnGetAtt): string {
    if (fnGetAttNode === undefined || fnGetAttNode === null) {
        throw new Error("Passed fnGetAttNode is undefined or null");
    }
    if (!("Fn::GetAtt" in fnGetAttNode)) {
        throw new Error("Fn::GetAtt node is not found in the passed object");
    }
    const resourceId: string | undefined = fnGetAttNode["Fn::GetAtt"][0];
    if (resourceId) {
        return resourceId;
    }
    return "";
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
// { "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] }
export function getFnJoinValue(fnJoinNode: FnJoin): string {
    if (fnJoinNode === undefined || fnJoinNode === null) {
        throw new Error("Passed fnJoinNode is undefined or null");
    }
    if (!("Fn::Join" in fnJoinNode)) {
        throw new Error("Fn::Join node is not found in the passed object");
    }
    if (!Array.isArray(fnJoinNode["Fn::Join"]) || fnJoinNode["Fn::Join"].length !== 2) {
        throw new Error(`Fn::Join should be array with length of 2 elements`);
    }

    const delimiter = fnJoinNode["Fn::Join"][0];

    if (delimiter === undefined || delimiter === null || typeof delimiter !== "string") {
        throw new Error("Delimiter is not valid");
    }

    const restOfTheElements = fnJoinNode["Fn::Join"].slice(1);

    if (restOfTheElements.length !== 1 || !Array.isArray(restOfTheElements[0])) {
        throw new Error("Fn:Join after slicing delimiter is not valid");
    }

    const stringsToJoin: string[] = [];
    restOfTheElements[0].forEach(obj => {
        if (typeof obj === "string") {
            stringsToJoin.push(obj);
        } else if ("Ref" in obj) {
            const refValue = getRefValue(obj);
            stringsToJoin.push(refValue);
        } else if ("Fn::GetAtt" in obj) {
            const getAttValue = getFnGetAttIdValue(obj);
            stringsToJoin.push(getAttValue);
        } else {
            throw new Error("Invalid object type");
        }
    });
    return stringsToJoin
        .map(str => str.trim())
        .filter(str => str.length > 0)
        .join(delimiter);
}

export function getFixedName(originalName: string | undefined, options?: ParsingOptions) {
    if (originalName === undefined || originalName === null) {
        return "";
    }
    if (options === undefined) {
        return originalName.trim();
    }

    let removePrefixValue: string = options[REMOVE_PREFIX_IN_RESOURCE_NAME];
    let removeSuffixValue: string = options[REMOVE_SUFFIX_IN_RESOURCE_NAME];
    let replaceTextValue: string = options[REPLACE_TEXT_IN_RESOURCE_NAME]; //String in format - OldValue,NewValue

    let result = originalName.trim();
    if (removePrefixValue !== undefined && !isEmptyString(removePrefixValue)) {
        result = removePrefix(result, removePrefixValue);
    }
    if (removeSuffixValue !== undefined && !isEmptyString(removeSuffixValue)) {
        result = removeSuffix(result, removeSuffixValue);
    }
    if (replaceTextValue !== undefined && !isEmptyString(replaceTextValue) && replaceTextValue.includes(",")) {
        const replaceValues = replaceTextValue.split(",");
        if (replaceValues.length !== 2) {
            throw new Error(`More than 2 elements in the replaceTextValue string, ${JSON.stringify(replaceValues)}`);
        }
        const [oldValue, newValue] = replaceValues;
        result = replaceSubstring(result, oldValue, newValue);
    }

    console.log(`Original name was: ${originalName}, result name: ${result}`);
    return result;


}