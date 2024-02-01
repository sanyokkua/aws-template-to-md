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
    removeSuffix,
    replaceSubstring,
}                                          from "../../string_utils";
import logger from "../../../logger";

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

export class MapperMappedStepFunctionsStateMachine implements Mapper<MappedStepFunctionsStateMachine> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedStepFunctionsStateMachine {
        basicResourceValidation(resource, AWS_STEP_FUNCTIONS_STATE_MACHINE);

        const sfResource: AwsStepFunctionsStateMachine = resource as AwsStepFunctionsStateMachine;
        const sfResourceId: string = sfResource._ID;
        const sfResourceType: string = sfResource.Type;
        const sfResourceName: string = getFixedName(sfResource._Name, options);

        let sfDefinition: string;
        if (sfResource?.Properties?.DefinitionString !== undefined) {
            sfDefinition = getStringValueForField(sfResource?.Properties?.DefinitionString);
        } else if (sfResource?.Properties?.Definition !== undefined) {
            const serializedString = JSON.stringify(sfResource.Properties.Definition);
            sfDefinition = getStringValueForField(serializedString);
        } else {
            logger.debug(sfResource, "State Machine Definition is not found in the resource");
            throw new Error("State Machine Definition is not found in the resource, check logs");
        }

        const updatedSFDefinition: string = replaceIdsInDefinition(sfDefinition, rawResourcesCollection, options);
        const parsedDefinition: StateMachineDefinition = JSON.parse(updatedSFDefinition);
        const mappedStateMachineDefinition: MappedStateMachineDefinition = mapSfDefinitionObject(parsedDefinition);

        return {
            id: sfResourceId,
            type: sfResourceType,
            name: sfResourceName,
            definition: updatedSFDefinition,
            definitionObj: mappedStateMachineDefinition,
        };
    }
}

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

function mapSfDefinitionObject(parsedDefinition: StateMachineDefinition): MappedStateMachineDefinition {
    const timeout = parsedDefinition.TimeoutSeconds;
    const firstTask = parsedDefinition.StartAt;
    const states = parsedDefinition.States;
    const mappedStates: MappedState[] = [];

    for (const statesKey in states) {
        const stateId = statesKey;
        const state = states[stateId];
        mappedStates.push(mapState(stateId, state));
    }

    return {
        "TimeoutSeconds": timeout,
        "StartAt": firstTask,
        "States": mappedStates,
    };
}

function mapState(stateId: string, state: State): MappedState {
    const stateType = state.Type;
    const mapper = STEP_FUNCTION_STATES_MAPPERS.get(stateType);
    if (mapper === undefined) {
        throw new Error(`Mapper for StateType=${stateType} is not found`);
    }

    return mapper(stateId, state);
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
    const mappedResource: MappedResource = findTaskResource(state);

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

function findTaskResource(state: State): MappedResource {
    const resourceArnFromTask = prepareArnValue(state);

    if (!resourceArnFromTask.startsWith("arn:")) {
        return {
            service: "",
            taskType: "",
            resourceName: resourceArnFromTask,
        };
    }

    const [, , serviceName, , , taskType, apiName] = resourceArnFromTask.split(":");
    if (serviceName === "states") {
        switch (taskType) {
            case "dynamodb": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.TableName);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "lambda": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.FunctionName);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "sns": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.TopicArn);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "sqs": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.QueueUrl);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "events": {
                const eventBusNames = new Set<string>();
                state.Parameters?.Entries?.forEach(entry => {
                    eventBusNames.add(extractNameFromResourceArn(entry.EventBusName));
                });
                const resourceName = Array.from(eventBusNames).join(",");
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "batch": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.JobName);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "glue": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.JobName);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "apigateway": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.EventBusName);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "states": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.StateMachineArn);
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceName,
                };
            }
            case "http": {
                const resourceName = extractNameFromResourceArn(state.Parameters?.ApiEndpoint);
                const method = state.Parameters?.Method ?? "NOT_DEFINED";
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: `${method} - ${resourceName}`,
                };
            }
            default: {
                return {
                    service: taskType,
                    taskType: apiName,
                    resourceName: resourceArnFromTask,
                };
            }
        }
    }

    return {
        service: serviceName,
        taskType: `${taskType}/${apiName}`,
        resourceName: extractNameFromResourceArn(resourceArnFromTask),
    };
}

function prepareArnValue(state: State) {
    const resourceValue = getStringValueForField(state.Resource);
    let resourceArnFromTask = resourceValue.trim().toLowerCase();
    [".waitfortasktoken", ".sync"].forEach(suffix => {
        resourceArnFromTask = removeSuffix(resourceArnFromTask, suffix);
    });
    return replaceSubstring(resourceArnFromTask, "aws-sdk:", "");
}

function extractNameFromResourceArn(resourceNameOrArn: string | undefined): string {
    const value = resourceNameOrArn ?? "";
    if (value.startsWith("arn:")) {
        const splitValues = value.split(":");
        const name = splitValues[splitValues.length - 1];
        if (name.includes("/")) {
            const nameSplit = name.split("/");
            return nameSplit[nameSplit.length - 1];
        } else {
            return name;
        }
    }
    return value;
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