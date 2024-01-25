import { CommonMappedResource } from "./mapped_common";

export interface MappedStepFunctionsStateMachine extends CommonMappedResource {
    definition: string; // AwsStepFunctionsStateMachine.Properties.DefinitionString
    definitionObj: MappedStateMachineDefinition;
}

export interface MappedCatchItem {
    "ErrorEquals": string[];
    "Next": string;
}

export interface MappedRetryItem {
    "ErrorEquals": string[];
    "IntervalSeconds"?: number; // default value: 1
    "MaxAttempts"?: number; // default: 3
    "BackoffRate"?: number; // default: 2.0
    "MaxDelaySeconds"?: number; //
    "JitterStrategy"?: string; //
}

export interface MappedResource {
    service: string;
    serviceAction: string;
    resourceName: string;
}

export interface MappedState {
    "StateID": string;
    "StateType": string;
    "Resource"?: MappedResource;
    "Next"?: string | string[];
    "End"?: boolean;
    "Retry"?: MappedRetryItem[];
    "Catch"?: MappedCatchItem[];
    "Error"?: string;
    "Cause"?: string;
    "Seconds"?: number;
    "Timestamp"?: string;
    "TimeoutSeconds"?: number;
    "TimestampPath"?: string;
    "HeartbeatSeconds"?: number,
    "Branches"?: MappedStateMachineDefinition[];
    "MaxConcurrency"?: number;
    "ItemProcessor"?: MappedStateMachineDefinition;
}

export interface MappedStateMachineDefinition {
    "TimeoutSeconds"?: number;
    "StartAt": string;
    "States": MappedState[];
}