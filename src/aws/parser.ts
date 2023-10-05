/*
AWS::ApiGateway::Authorizer
AWS::ApiGateway::Deployment
AWS::ApiGateway::GatewayResponse
AWS::ApiGateway::Method
AWS::ApiGateway::Model
AWS::ApiGateway::RequestValidator
AWS::ApiGateway::Resource
AWS::ApiGateway::RestApi
AWS::ApiGateway::Stage
AWS::CDK::Metadata
AWS::DynamoDB::Table
AWS::EC2::SecurityGroup
AWS::Events::ApiDestination
AWS::Events::Archive
AWS::Events::Connection
AWS::Events::EventBus
AWS::Events::EventBusPolicy
AWS::Events::EventBusPolicy
AWS::Events::Rule
AWS::Events::Rule
AWS::IAM::ManagedPolicy
AWS::IAM::Policy
AWS::IAM::Role
AWS::Lambda::EventSourceMapping
AWS::Lambda::Function
AWS::Lambda::Function
AWS::Logs::LogGroup
AWS::S3::Bucket
AWS::S3::BucketPolicy
AWS::SNS::Subscription
AWS::SNS::Topic
AWS::SNS::TopicPolicy
AWS::SQS::Queue
AWS::SQS::Queue
AWS::SQS::QueuePolicy
AWS::StepFunctions::StateMachine
Custom::AWSSecretsManagerStoreSecret
Custom::ApplyTagsToResource
Custom::LogRetention
Custom::ResourceDNS
Custom::S3BucketNotifications
* */
import { CloudForgeTemplate, Resource } from "./models/common";
import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayModel,
    AwsApiGatewayRequestValidator,
    AwsApiGatewayRestApi,
}                                       from "./models/apigateway/api";
import {
    AWS_ApiGateway_Authorizer,
    AWS_ApiGateway_Model,
    AWS_ApiGateway_RequestValidator,
    AWS_ApiGateway_RestApi,
    AWS_DynamoDB_Table,
    AWS_Events_Archive,
    AWS_Events_Connection,
    AWS_Events_EventBus,
    AWS_Events_Rule,
    AWS_Lambda_EventSourceMapping,
    AWS_Lambda_Function,
    AWS_S3_Bucket,
    AWS_SNS_Topic,
    AWS_SQS_Queue,
    AWS_StepFunctions_StateMachine,
}                                       from "./constants";
import {
    AwsDynamoDbTable,
}                                       from "./models/dynamodb/dynamodb";
import {
    AwsEventsArchive,
    AwsEventsConnection,
    AwsEventsEventBus,
    AwsEventsRule,
}                                       from "./models/events/eventbus";
import {
    AwsLambdaEventSourceMapping,
    AwsLambdaFunction,
}                                       from "./models/lambda/lambda";
import {
    AwsS3Bucket,
}                                       from "./models/s3/s3";
import {
    AwsSNSTopic,
}                                       from "./models/sns/sns";
import {
    AwsSQSQueue,
}                                       from "./models/sqs/sqs";
import {
    AwsStepFunctionsStateMachine,
}                                       from "./models/stepfunction/stepfunction";

export type ResourcesMappedByType = { [key: string]: Resource[] };
export type ResourcesMappedById = { [key: string]: Resource };

function removePrefix(originalValue: string, prefix: string): string {
    if (originalValue.startsWith(prefix)) {
        return originalValue.slice(prefix.length);
    } else {
        return originalValue;
    }
}

function removeSuffix(originalValue: string, suffix: string): string {
    if (originalValue.endsWith(suffix)) {
        return originalValue.slice(0, -suffix.length);
    } else {
        return originalValue;
    }
}

function getNameOrId(name: string | undefined | null, id: string, prefix: string | undefined, suffix: string | undefined) {
    if (name === undefined || name === null || name.length === 0) {
        return id;
    }
    let result = name;
    if (prefix !== undefined && prefix.length > 0 && result.startsWith(prefix)) {
        result = removePrefix(result, prefix);
    }
    if (suffix !== undefined && suffix.length > 0 && result.endsWith(suffix)) {
        result = removeSuffix(result, suffix);
    }
    return result;
}

export function parseCloudForgeTemplate(templateJsonString: string, prefix?: string, suffix?: string): [ResourcesMappedByType, ResourcesMappedById] {
    const cloudForgeTemplate: CloudForgeTemplate = JSON.parse(templateJsonString);
    const resourcesFromTemplate = cloudForgeTemplate.Resources;

    const resourcesMappedByType: ResourcesMappedByType = {};
    const resourcesMappedById: ResourcesMappedById = {};

    for (const key in resourcesFromTemplate) {
        const resource = resourcesFromTemplate[key];
        const resourceType = resource.Type;
        const resourceID = key;

        let expectedName;
        switch (resource.Type) {
            case AWS_ApiGateway_Authorizer: {
                expectedName = (resource as AwsApiGatewayAuthorizer).Properties.Name;
                break;
            }
            case AWS_ApiGateway_Model: {
                expectedName = (resource as AwsApiGatewayModel).Properties.Name;
                break;
            }
            case AWS_ApiGateway_RequestValidator: {
                expectedName = (resource as AwsApiGatewayRequestValidator).Properties.Name;
                break;
            }
            case AWS_ApiGateway_RestApi: {
                expectedName = (resource as AwsApiGatewayRestApi).Properties.Name;
                break;
            }
            case AWS_DynamoDB_Table: {
                expectedName = (resource as AwsDynamoDbTable).Properties.TableName;
                break;
            }
            case AWS_Events_Archive: {
                expectedName = (resource as AwsEventsArchive).Properties.ArchiveName;
                break;
            }
            case AWS_Events_Connection: {
                expectedName = (resource as AwsEventsConnection).Properties.Name;
                break;
            }
            case AWS_Events_EventBus: {
                expectedName = (resource as AwsEventsEventBus).Properties.Name;
                break;
            }
            case AWS_Events_Rule: {
                expectedName = (resource as AwsEventsRule).Properties.Name;
                break;
            }
            case AWS_Lambda_EventSourceMapping: {
                expectedName = (resource as AwsLambdaEventSourceMapping).Properties.EventSourceArn;
                break;
            }
            case AWS_Lambda_Function: {
                expectedName = (resource as AwsLambdaFunction).Properties.FunctionName;
                break;
            }
            case AWS_S3_Bucket: {
                expectedName = (resource as AwsS3Bucket).Properties.BucketName;
                break;
            }
            case AWS_SNS_Topic: {
                expectedName = (resource as AwsSNSTopic).Properties.TopicName;
                break;
            }
            case AWS_SQS_Queue: {
                expectedName = (resource as AwsSQSQueue).Properties.QueueName;
                break;
            }
            case AWS_StepFunctions_StateMachine: {
                expectedName = (resource as AwsStepFunctionsStateMachine).Properties.StateMachineName;
                break;
            }
            default: {
                expectedName = undefined;
                break;
            }
        }

        resource.ID = resourceID;
        resource.Name = getNameOrId(expectedName, resourceID, prefix, suffix);

        if (resourcesMappedByType[resourceType] !== undefined) {
            resourcesMappedByType[resourceType].push(resource);
        } else {
            resourcesMappedByType[resourceType] = [];
            resourcesMappedByType[resourceType].push(resource);
        }

        resourcesMappedById[key] = resource;
    }

    return [resourcesMappedByType, resourcesMappedById];
}
