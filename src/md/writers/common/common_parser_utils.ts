import { FnGetAtt, FnJoinType, Resource } from "../../../aws/models/common";
import { ResourcesMappedById }            from "../../../aws/parser";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
// { "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] } TODO: Update with specification
export function fnJoin(fnJoinNode: FnJoinType, resources: ResourcesMappedById): string {
    const stringsToJoin: string[] = [];
    fnJoinNode.forEach(value => {
        if (typeof value === "string") {
            stringsToJoin.push(value);
        } else if (Array.isArray(value)) {
            value.forEach(innerValue => {
                if (typeof innerValue === "string") {
                    stringsToJoin.push(innerValue);
                } else {
                    if ("Ref" in innerValue) {
                        stringsToJoin.push(innerValue.Ref);
                    } else if ("Fn::GetAtt" in innerValue) {
                        const resource = fnGetAtt(innerValue, resources);
                        if (resource) {
                            stringsToJoin.push(resource.Name);
                        }
                    }
                }
            });
        }
    });
    return stringsToJoin.join("");
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
// { "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] } => logicalNameOfResource.attributeName
// As result LogicalID is always first attribute
export function fnGetAtt(fnGetAttNode: FnGetAtt, resources: ResourcesMappedById): Resource | undefined {
    if (fnGetAttNode === undefined) {
        return undefined;
    }
    if (!("Fn::GetAtt" in fnGetAttNode)) {
        return undefined;
    }
    const resourceId: string | undefined = fnGetAttNode["Fn::GetAtt"][0];
    if (resourceId) {
        return resources[resourceId];
    }
    return undefined;
}