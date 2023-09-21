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
    AWS_Events_EventBusPolicy,
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
    AwsEventsEventBusPolicy,
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

function getNameOrId(name: string | undefined | null, id: string) {
    if (name === undefined || name === null || name.length === 0) {
        return id;
    }
    return id;
}

export function parseCloudForgeTemplate(templateJsonString: string): [ResourcesMappedByType, ResourcesMappedById] {
    let template: CloudForgeTemplate = JSON.parse(templateJsonString);

    const resourcesMappedByType: ResourcesMappedByType = {};
    const resourcesMappedById: ResourcesMappedById = {};

    const resources = template.Resources;
    for (let key in resources) {
        const currentResource = resources[key];
        const resourceType = currentResource.Type;
        currentResource.ID = key;

        switch (currentResource.Type) {
            case AWS_ApiGateway_Authorizer: {
                currentResource.Name = getNameOrId((currentResource as AwsApiGatewayAuthorizer).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_ApiGateway_Model: {
                currentResource.Name = getNameOrId((currentResource as AwsApiGatewayModel).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_ApiGateway_RequestValidator: {
                currentResource.Name = getNameOrId((currentResource as AwsApiGatewayRequestValidator).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_ApiGateway_RestApi: {
                currentResource.Name = getNameOrId((currentResource as AwsApiGatewayRestApi).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_DynamoDB_Table: {
                currentResource.Name = getNameOrId((currentResource as AwsDynamoDbTable).Properties.TableName,
                                                   currentResource.ID);
                break;
            }
            case AWS_Events_Archive: {
                currentResource.Name = getNameOrId((currentResource as AwsEventsArchive).Properties.ArchiveName,
                                                   currentResource.ID);
                break;
            }
            case AWS_Events_Connection: {
                currentResource.Name = getNameOrId((currentResource as AwsEventsConnection).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_Events_EventBus: {
                currentResource.Name = getNameOrId((currentResource as AwsEventsEventBus).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_Events_EventBusPolicy: {
                currentResource.Name = getNameOrId((currentResource as AwsEventsEventBusPolicy).Properties.EventBusName,
                                                   currentResource.ID);
                break;
            }
            case AWS_Events_Rule: {
                currentResource.Name = getNameOrId((currentResource as AwsEventsRule).Properties.Name,
                                                   currentResource.ID);
                break;
            }
            case AWS_Lambda_EventSourceMapping: {
                currentResource.Name = getNameOrId((currentResource as AwsLambdaEventSourceMapping).Properties.EventSourceArn,
                                                   currentResource.ID);
                break;
            }
            case AWS_Lambda_Function: {
                currentResource.Name = getNameOrId((currentResource as AwsLambdaFunction).Properties.FunctionName,
                                                   currentResource.ID);
                break;
            }
            case AWS_S3_Bucket: {
                currentResource.Name = getNameOrId((currentResource as AwsS3Bucket).Properties.BucketName,
                                                   currentResource.ID);
                break;
            }
            case AWS_SNS_Topic: {
                currentResource.Name = getNameOrId((currentResource as AwsSNSTopic).Properties.TopicName,
                                                   currentResource.ID);
                break;
            }
            case AWS_SQS_Queue: {
                currentResource.Name = getNameOrId((currentResource as AwsSQSQueue).Properties.QueueName,
                                                   currentResource.ID);
                break;
            }
            case AWS_StepFunctions_StateMachine: {
                currentResource.Name = getNameOrId((currentResource as AwsStepFunctionsStateMachine).Properties.StateMachineName,
                                                   currentResource.ID);
                break;
            }
            default: {
                currentResource.Name = currentResource.ID;
                break;
            }
        }

        if (resourcesMappedByType[resourceType] !== undefined) {
            resourcesMappedByType[resourceType].push(currentResource);
        } else {
            resourcesMappedByType[resourceType] = [];
            resourcesMappedByType[resourceType].push(currentResource);
        }
        resourcesMappedById[key] = currentResource;
    }

    return [resourcesMappedByType, resourcesMappedById];
}
