import { Mapper }                                               from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { CommonMappedResource }                                 from "../models/mapped_common";
import { ParsingOptions }                                       from "../options/parsing_options";
import { getFixedName }                                         from "../utils/utils";

export class MapperDefault implements Mapper<CommonMappedResource> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): CommonMappedResource {
        return {
            id: resource._ID,
            type: resource.Type,
            name: getFixedName(resource._Name, options),
        };
    }
}