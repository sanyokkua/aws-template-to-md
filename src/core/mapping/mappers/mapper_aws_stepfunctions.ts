import { basicResourceValidation, Mapper } from "./mapper";
import {
    CommonResource,
    RawCloudFormationResourcesCollection,
}                                          from "../../cloudformation/models/common_models";
import {
    ParsingOptions,
}                                          from "../options/parsing_options";
import {
    getFixedName,
    getStringValueForField,
}                                          from "../utils/utils";
import {
    MappedCatchItem,
    MappedResource,
    MappedRetryItem,
    MappedState,
    MappedStateMachineDefinition,
    MappedStepFunctionsStateMachine,
}                                          from "../models/mapped_aws_stepfunctions";
import {
    AWS_STEP_FUNCTIONS_STATE_MACHINE,
}                                          from "../../cloudformation/constants";
import {
    AwsStepFunctionsStateMachine,
    CatchItem,
    RetryItem,
    State,
    StateMachineDefinition,
    StateTypes,
}                                          from "../../cloudformation/models/aws_stepfunctions";
import {
    isEmptyString,
}                                          from "../../string_utils";

type StateMapperFn = (stateId: string, state: State) => MappedState;

const DEFAULT_RETRY_INTERVAL_SECONDS: number = 1;
const DEFAULT_RETRY_MAX_ATTEMPTS: number = 3;
const DEFAULT_RETRY_BACKOFF_RATE: number = 2.0;
const STEP_FUNCTION_STATES_MAPPERS = new Map<StateTypes, StateMapperFn>(
    [
        [StateTypes.Pass, mapStateOfTypePass],
        [StateTypes.Task, mapStateOfTypeTask],
        [StateTypes.Choice, mapStateOfTypeChoice],
        [StateTypes.Wait, mapStateOfTypeWait],
        [StateTypes.Succeed, mapStateOfTypeSucceed],
        [StateTypes.Fail, mapStateOfTypeFail],
        [StateTypes.Parallel, mapStateOfTypeParallel],
        [StateTypes.Map, mapStateOfTypeMap],
    ]);

function replaceIdsInDefinition(definition: string, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): string {
    if (isEmptyString(definition)) {
        return "";
    }

    const allResources = rawResourcesCollection.getAllResources();
    for (const resource of allResources) {
        const originalName = resource._Name;
        const resourceId = resource._ID;

        if (definition.includes(originalName)) {
            const name: string = getFixedName(originalName, options);
            definition = definition.replace(originalName, name);
        }
        if (definition.includes(resourceId)) {
            const name: string = getFixedName(originalName, options);
            definition = definition.replace(resourceId, name);
        }
    }

    return definition;
}

export class MapperMappedStepFunctionsStateMachine implements Mapper<MappedStepFunctionsStateMachine> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedStepFunctionsStateMachine {
        basicResourceValidation(resource, AWS_STEP_FUNCTIONS_STATE_MACHINE);

        const sfResource: AwsStepFunctionsStateMachine = resource as AwsStepFunctionsStateMachine;
        const sfResourceId: string = sfResource._ID;
        const sfResourceType: string = sfResource.Type;
        const sfResourceName: string = getFixedName(sfResource._Name, options);

        const sfDefinition: string = getStringValueForField(sfResource?.Properties?.DefinitionString);
        const updatedSFDefinition: string = replaceIdsInDefinition(sfDefinition, rawResourcesCollection, options);

        const parsedDefinition: StateMachineDefinition = JSON.parse(updatedSFDefinition);
        const mappedStateMachineDefinition = mapSfDefinitionObject(parsedDefinition);

        return {
            id: sfResourceId,
            type: sfResourceType,
            name: sfResourceName,
            definition: updatedSFDefinition,
            definitionObj: mappedStateMachineDefinition,
        };
    }


}

function mapState(stateId: string, state: State): MappedState {
    const stateType = state.Type;
    const mapper = STEP_FUNCTION_STATES_MAPPERS.get(stateType);
    if (mapper === undefined) {
        throw new Error(`Mapper for StateType=${stateType} is not found`);
    }

    return mapper(stateId, state);
}

function mapSfDefinitionObject(parsedDefinition: StateMachineDefinition) {
    const timeout = parsedDefinition.TimeoutSeconds;
    const firstTask = parsedDefinition.StartAt;
    const states = parsedDefinition.States;
    const mappedStates: MappedState[] = [];

    for (const statesKey in states) {
        const stateId = statesKey;
        const state = states[stateId];
        mappedStates.push(mapState(stateId, state));
    }

    const mappedSf: MappedStateMachineDefinition = {
        "TimeoutSeconds": timeout,
        "StartAt": firstTask,
        "States": mappedStates,
    };
    return mappedSf;
}

function mapStateOfTypePass(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Pass, state.Type);
    const isFinalTask = state.End ?? false;

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": state.Next,
        "End": isFinalTask,
    };
}


function mapStateOfTypeTask(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Task, state.Type);
    const isFinalTask = state.End ?? false;
    const retryItems: MappedRetryItem[] = mapRetryItems(state?.Retry);
    const catchItems: MappedCatchItem[] = mapCatchItems(state?.Catch);

    let service: string;
    let serviceAction: string;
    let resourceName: string;

    const resUri = state.Resource ?? "";
    if (resUri.trim().toLowerCase().startsWith("arn:aws:states:::")) {
        // arn:aws:states:::dynamodb:getItem
        const resourceAndAction = resUri.trim().replace("arn:aws:states:::", "");
        [service, serviceAction] = resourceAndAction.split(":");

        switch (service) {
            case "dynamodb": {
                resourceName = state.Parameters?.TableName ?? "";
                break;
            }
            case "lambda": {
                resourceName = state.Parameters?.FunctionName ?? "";
                break;
            }
            case "sns": {
                resourceName = state.Parameters?.TopicArn ?? "";
                break;
            }
            case "sqs": {
                resourceName = state.Parameters?.QueueUrl ?? "";
                break;
            }
            case "events": {
                const eventBusNames = new Set<string>();
                state.Parameters?.Entries?.forEach(entry => {
                    const value = entry.EventBusName ?? "";
                    if (value.trim().toLowerCase().startsWith("arn:")) {
                        const splitValues = value.trim().toLowerCase().split(":");
                        const name = splitValues[splitValues.length - 1];
                        if (name.includes("/")) {
                            const nameSplit = name.split("/");
                            eventBusNames.add(nameSplit[nameSplit.length - 1]);
                        } else {
                            eventBusNames.add(name);
                        }
                    } else {
                        eventBusNames.add(value);
                    }
                });
                resourceName = Array.from(eventBusNames).join(",");
                break;
            }
            default: {
                resourceName = resourceAndAction;
                break;
            }
        }
    } else if (resUri.trim().toLowerCase().startsWith("arn:aws:")) {
        // arn:aws:dynamodb:us-west-2:123456789012:table/myDynamoDBTable
        service = resUri.trim().toLowerCase().split(":")[2];
        serviceAction = "";
        resourceName = resUri.trim().split(":")[-1];
        console.log("Warning:: Not tested retrieving resource Name");
    } else {
        service = "";
        serviceAction = "";
        resourceName = resUri;
        console.log("Warning:: Not tested retrieving resource Name");
    }

    let mappedResource: MappedResource = {
        service: service,
        serviceAction: serviceAction,
        resourceName: resourceName,
    };

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": state.Next,
        "Resource": mappedResource,
        "End": isFinalTask,
        "Retry": retryItems,
        "Catch": catchItems,
        "Seconds": state.Seconds,
        "Timestamp": state.Timestamp,
        "TimestampPath": state.TimestampPath,
        "TimeoutSeconds": state.TimeoutSeconds,
    };
}

function mapStateOfTypeChoice(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Choice, state.Type);

    const nextStates = state.Choices?.map(c => c.Next) ?? [];
    nextStates.push(state?.Default ?? "");

    const result = nextStates.filter(v => !isEmptyString(v));
    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": result,
    };
}

function mapStateOfTypeWait(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Wait, state.Type);

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": state.Next,
        "Seconds": state.Seconds,
        "Timestamp": state.Timestamp,
        "TimestampPath": state.TimestampPath,
    };
}

function mapStateOfTypeSucceed(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Succeed, state.Type);
    return {
        "StateID": stateId,
        "StateType": state.Type,
        "End": true,
    };
}

function mapStateOfTypeFail(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Fail, state.Type);

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "End": true,
        "Error": state.Error,
        "Cause": state.Cause,
    };
}

function mapStateOfTypeParallel(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Parallel, state.Type);
    const res = state.Branches?.map(branch => mapSfDefinitionObject(branch)) ?? [];

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": state.Next,
        "End": state.End,
        "Branches": res,
    };
}

function mapStateOfTypeMap(stateId: string, state: State): MappedState {
    validateStateType(StateTypes.Map, state.Type);

    return {
        "StateID": stateId,
        "StateType": state.Type,
        "Next": state.Next,
        "End": state.End,
    };
}

function validateStateType(expectedType: StateTypes, actualStateType: StateTypes) {
    if (actualStateType === undefined || actualStateType === null || expectedType !== actualStateType) {
        throw new Error(`Expected StateType ${expectedType} is not equal to actual StateType ${actualStateType}`);
    }
}

function mapRetryItems(retryItems: RetryItem[] | undefined) {
    return retryItems?.map(retry => {
        return {
            "ErrorEquals": retry.ErrorEquals,
            "IntervalSeconds": retry?.IntervalSeconds ?? DEFAULT_RETRY_INTERVAL_SECONDS, // default value: 1
            "MaxAttempts": retry?.MaxAttempts ?? DEFAULT_RETRY_MAX_ATTEMPTS, // default: 3
            "BackoffRate": retry?.BackoffRate ?? DEFAULT_RETRY_BACKOFF_RATE, // default: 2.0
            "MaxDelaySeconds": retry?.MaxDelaySeconds, //
            "JitterStrategy": retry?.JitterStrategy ?? "", //
        };
    }) ?? [];
}

function mapCatchItems(catchItems: CatchItem[] | undefined): MappedCatchItem[] {
    return catchItems?.map(item => {
        return {
            "ErrorEquals": item.ErrorEquals,
            "Next": item.Next,
        };
    }) ?? [];
}