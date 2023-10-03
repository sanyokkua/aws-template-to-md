/*
AWS::StepFunctions::StateMachine
* */

import { CommonResourceInfo, FnJoinType } from "../common";

export interface AwsStepFunctionsStateMachine extends CommonResourceInfo {
    "Properties": {
        "Definition": any,
        "DefinitionString": {
                                "Fn::Join": FnJoinType
                            } | string,
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
    "UpdateReplacePolicy": string;
    "DeletionPolicy": string;
}