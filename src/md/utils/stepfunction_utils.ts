import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { StepFunctionsStateMachine }                  from "../models/models";
import { AWS_StepFunctions_StateMachine }             from "../../aws/constants";
import { AwsStepFunctionsStateMachine }               from "../../aws/models/stepfunction/stepfunction";
import { fnJoin }                                     from "../writers/common/common_parser_utils";

function replaceIdsInDefinition(definition: string, resourcesById: ResourcesMappedById): string {
    if (definition === undefined || definition.length == 0) {
        return "";
    }
    for (let resourcesByIdKey in resourcesById) {
        if (definition.includes(resourcesByIdKey)) {
            const name: string = resourcesById[resourcesByIdKey].Name;
            definition = definition.replace(resourcesByIdKey, name);
        }
    }
    return definition;
}

export function getMappedStepFunctionsStateMachine(resources: [ResourcesMappedByType, ResourcesMappedById]): StepFunctionsStateMachine[] {
    const resourcesByType = resources[0];
    const resourcesById = resources[1];
    const result: StepFunctionsStateMachine[] = [];
    const stepFunctions = resourcesByType[AWS_StepFunctions_StateMachine];

    if (stepFunctions === undefined || stepFunctions.length === 0) {
        return result;
    }

    return stepFunctions
        .map(resource => resource as AwsStepFunctionsStateMachine)
        .map(stepFunction => {
            const stateMachineName =
                stepFunction.Name !== undefined &&
                stepFunction.Name.length > 0
                ? stepFunction.Name : stepFunction.ID;

            let definition: string;
            if (typeof stepFunction.Properties.DefinitionString === "string") {
                definition = stepFunction.Properties.DefinitionString;
            } else {
                definition = fnJoin(stepFunction.Properties.DefinitionString["Fn::Join"], resourcesById);
            }

            definition = replaceIdsInDefinition(definition, resourcesById);

            return {
                id: stepFunction.ID,
                type: stepFunction.Type,
                name: stateMachineName,
                definition: definition,
                updateReplacePolicy: stepFunction.UpdateReplacePolicy,
                deletionPolicy: stepFunction.DeletionPolicy,
            };
        });
}
