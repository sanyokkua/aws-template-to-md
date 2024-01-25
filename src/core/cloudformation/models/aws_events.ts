import { CommonResource, StringType } from "./common_models";

// AWS::Events::ApiDestination
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-apidestination.html
export interface AwsEventsApiDestination extends CommonResource {
    "Properties": {
        "ConnectionArn": {
            "Fn::GetAtt": string[]
        },
        "HttpMethod": string,
        "InvocationEndpoint": string
    },
}

// AWS::Events::Archive
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-archive.html
export interface AwsEventsArchive extends CommonResource {
    "Properties": {
        "ArchiveName": string,
        "Description": string,
        "EventPattern": any,
        "RetentionDays": number,
        "SourceArn": {
            "Fn::GetAtt": string[]
        },
    };
}

// AWS::Events::Connection
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-connection.html
export interface AwsEventsConnection extends CommonResource {
    "Properties": {
        "AuthorizationType": string,
        "AuthParameters": {
            "ApiKeyAuthParameters": {
                "ApiKeyName": string,
                "ApiKeyValue": string
            },
            "BasicAuthParameters": {
                "Password": string,
                "Username": string
            },
            "InvocationHttpParameters": {
                "BodyParameters": {
                    "IsValueSecret": boolean,
                    "Key": string,
                    "Value": string
                }[],
                "HeaderParameters": {
                    "IsValueSecret": boolean,
                    "Key": string,
                    "Value": string
                }[],
                "QueryStringParameters": {
                    "IsValueSecret": boolean,
                    "Key": string,
                    "Value": string
                }[]
            },
            "OAuthParameters": {
                "AuthorizationEndpoint": string,
                "ClientParameters": {
                    "ClientID": string,
                    "ClientSecret": string
                },
                "HttpMethod": string,
                "OAuthHttpParameters": {
                    "BodyParameters": {
                        "IsValueSecret": boolean,
                        "Key": string,
                        "Value": string
                    }[],
                    "HeaderParameters": {
                        "IsValueSecret": boolean,
                        "Key": string,
                        "Value": string
                    }[],
                    "QueryStringParameters": {
                        "IsValueSecret": boolean,
                        "Key": string,
                        "Value": string
                    }[]
                }
            }
        },
        "Description": string,
        "Name": string
    };
}

// AWS::Events::EventBus
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html
export interface AwsEventsEventBus extends CommonResource {
    "Properties": {
        "EventSourceName": string,
        "Name": string,
        "Tags": {
            "Key": string,
            "Value": string
        }[]
    };
}

// AWS::Events::EventBusPolicy
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbuspolicy.html
export interface AwsEventsEventBusPolicy extends CommonResource {
    "Properties": {
        "Action": string,
        "Condition": {
            "Key": string,

            "Value": string
        },
        "EventBusName": string,
        "Principal": string,
        "Statement": any,
        "StatementId": string
    };
}

export interface AwsEventRuleTarget {
    "Arn": StringType,
    "DeadLetterConfig": {
        "Arn": StringType
    },
    "Id": string,
    "Input": string,
    "InputPath": string,
    "InputTransformer": {
        "InputPathsMap": { [key: string]: string },
        "InputTemplate": string
    },
    "RetryPolicy": {
        "MaximumEventAgeInSeconds": number,
        "MaximumRetryAttempts": number
    },
    "SqsParameters": {
        "MessageGroupId": string
    }
}

// AWS::Events::Rule
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html
export interface AwsEventsRule extends CommonResource {
    "Properties": {
        "Description": string,
        "EventBusName": StringType,
        "EventPattern": any,
        "Name": string,
        "RoleArn": string,
        "ScheduleExpression": string,
        "State": string,
        "Targets": AwsEventRuleTarget[]
    };
}