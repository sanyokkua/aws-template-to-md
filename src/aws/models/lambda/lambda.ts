/*
AWS::Lambda::EventSourceMapping
AWS::Lambda::Function
* */

import { CommonResourceInfo } from "../common";

export interface AwsLambdaEventSourceMapping extends CommonResourceInfo {
    "Properties": {
        "FunctionName": {
            "Ref": string
        },
        "EventSourceArn": string,
        "BatchSize": number,
        "Enabled": boolean,
    };
}

export interface AwsLambdaFunction extends CommonResourceInfo {
    "Properties": {
        "Architectures": string[],
        "DeadLetterConfig": {
            "TargetArn": string
        },
        "Description": string,
        "Environment": {
            "Variables": { [key: string]: any },
        },
        "EphemeralStorage": {
            "Size": number
        },
        "FunctionName": string,
        "Handler": string,
        "MemorySize": number,
        "Runtime": string,
        "Timeout": number,
        "TracingConfig": {
            "Mode": string
        },
        "VpcConfig": {
            "SecurityGroupIds": string[],
            "SubnetIds": string[ ]
        }
    };
}