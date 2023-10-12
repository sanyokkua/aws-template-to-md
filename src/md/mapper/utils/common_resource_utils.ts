import { ResourcesMappedById, ResourcesMappedByType } from "../../../aws/parser";
import { CommonResource }                             from "../models/models";

export function getCommonResources(resources: [ResourcesMappedByType, ResourcesMappedById]): CommonResource[] {
    const resourcesByType = resources[0];
    const resourcesById = resources[1];
    const result: CommonResource[] = [];

    if (resourcesByType === undefined) {
        return result;
    }

    const allResources: CommonResource[] = [];

    for (const key in resourcesById) {
        const resource = resourcesById[key];
        allResources.push({
                              id: resource.ID,
                              type: resource.Type,
                              name: resource.Name,
                          });
    }

    return allResources;
}
