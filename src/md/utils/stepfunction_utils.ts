import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { StepFunctionsStateMachine }                  from "../models";
import { AWS_StepFunctions_StateMachine }             from "../../aws/constants";
import { AwsStepFunctionsStateMachine }               from "../../aws/models/stepfunction/stepfunction";
import { fnJoin }                                     from "../common_utils";

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
                stepFunction.Properties.StateMachineName !== undefined &&
                stepFunction.Properties.StateMachineName.length > 0
                ? stepFunction.Properties.StateMachineName : stepFunction.ID;

            let definition: string;
            if (typeof stepFunction.Properties.DefinitionString === "string") {
                definition = stepFunction.Properties.DefinitionString;
            } else {
                definition = fnJoin(stepFunction.Properties.DefinitionString["Fn::Join"], resourcesById);
            }

            return {
                type: stepFunction.Type,
                name: stateMachineName,
                definition: definition,
                updateReplacePolicy: stepFunction.UpdateReplacePolicy,
                deletionPolicy: stepFunction.DeletionPolicy,
            };
        });
}
