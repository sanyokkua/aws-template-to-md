import { CommonResource } from "./common_models";

// AWS::Lambda::EventSourceMapping
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html
export interface AwsLambdaEventSourceMapping extends CommonResource {
    "Properties": {
        "FunctionName": {
            "Ref": string
        },
        "EventSourceArn": string,
        "BatchSize": number,
        "Enabled": boolean,
    };
}

// AWS::Lambda::Function
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html
export interface AwsLambdaFunction extends CommonResource {
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
            "SubnetIds": string[]
        }
    };
}