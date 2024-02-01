import { CommonResource, StringType } from "./common_models";


// AWS::StepFunctions::StateMachine
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-stepfunctions-statemachine.html
export interface AwsStepFunctionsStateMachine extends CommonResource {
    "Properties": {
        "Definition": any,
        "DefinitionString": StringType,
        "DefinitionSubstitutions": { [key: string]: any },
        "LoggingConfiguration": {
            "Destinations": {
                "CloudWatchLogsLogGroup": {
                    "LogGroupArn": string
                }
            }[],
            "IncludeExecutionData": boolean,
            "Level": string
        },
        "RoleArn": string,
        "StateMachineName": string,
        "StateMachineType": string,
        "TracingConfiguration": {
            "Enabled": boolean
        }
    };
}

export enum StateTypes {
    Pass = "Pass",
    Task = "Task",
    Choice = "Choice",
    Wait = "Wait",
    Succeed = "Succeed",
    Fail = "Fail",
    Parallel = "Parallel",
    Map = "Map",
}

// https://states-language.net/spec.html#structure-of-a-state-machine

export interface ChoiceItem {
    "Next": string;

    [key: string]: any; // Not interesting for now
}

export interface CatchItem {
    "ErrorEquals": string[];
    "Next": string;
    "ResultPath"?: string;
}

export interface RetryItem {
    "ErrorEquals": string[];
    "IntervalSeconds"?: number; // default value: 1
    "MaxAttempts"?: number; // default: 3
    "BackoffRate"?: number; // default: 2.0
    "MaxDelaySeconds"?: number; //
    "JitterStrategy"?: string; //
}

export interface StateParameters {
    "FunctionName"?: string;
    "QueueUrl"?: string;
    "TopicArn"?: string;
    "Entries"?: [{ EventBusName?: string, [key: string]: any }];
    "TableName"?: string;

    [key: string]: any;
}

export interface State {
    "Type": StateTypes;
    "Resource"?: StringType;
    "Next"?: string;
    "Comment"?: string;
    "End"?: boolean;
    "Parameters"?: StateParameters; // Not interesting for now
    "InputPath"?: string;
    "ResultPath"?: string;
    "Retry"?: RetryItem[];
    "Catch"?: CatchItem[];
    "Choices"?: ChoiceItem[];
    "Default"?: string;
    "Seconds"?: number;
    "HeartbeatSeconds"?: number;
    "TimeoutSeconds"?: number;
    "Timestamp"?: string;
    "TimestampPath"?: string;
    "Error"?: string;
    "Cause"?: string;
    "ErrorPath"?: string;
    "CausePath"?: string;
    "Branches"?: StateMachineDefinition[];
    "MaxConcurrency"?: number;
    "ItemProcessor"?: StateMachineDefinition;
    "ItemsPath"?: string;
    "ItemSelector": { [key: string]: any };
}

export interface States {
    [key: string]: State;
}

export interface StateMachineDefinition {
    "Comment"?: string;
    "Version"?: string;
    "TimeoutSeconds"?: number;
    "StartAt": string;
    "States": States;
}