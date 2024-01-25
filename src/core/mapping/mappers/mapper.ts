import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";

export interface Mapper<O> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): O;
}

export function basicResourceValidation(resource: CommonResource | undefined | null, expectedType: string): void {
    if (resource === undefined || resource === null) {
        throw new Error("Passed resource to mapper is undefined or null");
    }

    if (resource.Type !== expectedType) {
        throw new Error(`Passed resource type expected is ${expectedType} but received ${resource.Type}`);
    }
}