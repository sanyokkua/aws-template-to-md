/*
AWS::Events::ApiDestination
AWS::Events::Archive
AWS::Events::Connection
AWS::Events::EventBus
AWS::Events::EventBusPolicy
AWS::Events::Rule
* */

import { CommonResourceInfo } from "../common";

export interface AwsEventsApiDestination extends CommonResourceInfo {
    "Properties": {
        "ConnectionArn": {
            "Fn::GetAtt": string[]
        },
        "HttpMethod": string,
        "InvocationEndpoint": string
    },
}

export interface AwsEventsArchive extends CommonResourceInfo {
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

export interface AwsEventsConnection extends CommonResourceInfo {
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

export interface AwsEventsEventBus extends CommonResourceInfo {
    "Properties": {
        "EventSourceName": string,
        "Name": string,
        "Tags": {
            "Key": string,
            "Value": string
        }[]
    };
}

export interface AwsEventsEventBusPolicy extends CommonResourceInfo {
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

export interface AwsEventsRule extends CommonResourceInfo {
    "Properties": {
        "Description": string,
        "EventBusName": {
            "Ref": string
        },
        "EventPattern": any,
        "Name": string,
        "RoleArn": string,
        "ScheduleExpression": string,
        "State": string,
        "Targets": {
            "Arn": {
                       "Ref": string,
                       "Fn::GetAtt": string[]
                   } | string,
            "DeadLetterConfig": {
                "Arn": {
                    "Fn::GetAtt": string[]
                }
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
        }[]
    };
}