import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import logger from "../../../logger";

export interface Mapper<O> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): O;
}

export function basicResourceValidation(resource: CommonResource | undefined | null, expectedType: string): void {
    if (resource === undefined || resource === null) {
        logger.error({}, "basicResourceValidation. Passed resource is null");
        throw new Error("Passed resource to mapper is undefined or null, check console for details");
    }

    if (resource.Type !== expectedType) {
        logger.error({resource, expectedType},
                     "basicResourceValidation. Passed resource type and expected types are different");
        throw new Error(`Passed resource type expected is ${expectedType} but received ${resource.Type}, check console for details`);
    }
}