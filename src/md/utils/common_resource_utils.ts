import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { CommonResource, StepFunctionsStateMachine }  from "../models/models";
import { AWS_StepFunctions_StateMachine }             from "../../aws/constants";

export function getCommonResources(resources: [ResourcesMappedByType, ResourcesMappedById]): CommonResource[] {
    const resourcesByType = resources[0];
    const resourcesById = resources[1];
    const result: StepFunctionsStateMachine[] = [];
    const stepFunctions = resourcesByType[AWS_StepFunctions_StateMachine];

    if (stepFunctions === undefined || stepFunctions.length === 0) {
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
