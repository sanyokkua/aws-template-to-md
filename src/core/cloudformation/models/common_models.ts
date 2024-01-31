// Description of the core ideas of template
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html

import { isEmptyString } from "../../string_utils";
import {
    AWS_API_GATEWAY_AUTHORIZER,
    AWS_API_GATEWAY_MODEL,
    AWS_API_GATEWAY_REQUEST_VALIDATOR,
    AWS_API_GATEWAY_REST_API,
    AWS_DYNAMO_DB_TABLE,
    AWS_EVENTS_ARCHIVE,
    AWS_EVENTS_CONNECTION,
    AWS_EVENTS_EVENT_BUS,
    AWS_EVENTS_RULE,
    AWS_LAMBDA_FUNCTION,
    AWS_S3_BUCKET,
    AWS_SNS_TOPIC,
    AWS_SQS_QUEUE,
    AWS_STEP_FUNCTIONS_STATE_MACHINE,
}                        from "../constants";
import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayModel,
    AwsApiGatewayRequestValidator,
    AwsApiGatewayRestApi,
}                        from "./aws_apigateway";
import {
    AwsDynamoDbTable,
}                        from "./aws_dynamodb";
import {
    AwsEventsArchive,
    AwsEventsConnection,
    AwsEventsEventBus,
    AwsEventsRule,
}                        from "./aws_events";
import {
    AwsLambdaFunction,
}                        from "./aws_lambda";
import {
    AwsS3Bucket,
}                        from "./aws_s3";
import {
    AwsSNSTopic,
}                        from "./aws_sns";
import {
    AwsSQSQueue,
}                        from "./aws_sqs";
import {
    AwsStepFunctionsStateMachine,
}                        from "./aws_stepfunctions";

export type LogicalID = string;
export type ResourceType = string;

export type Ref = { "Ref": string };

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
// { "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] }
export type FnGetAtt = { "Fn::GetAtt": string[] };

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
// { "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] }
export type FnJoin = { "Fn::Join": (string | (string | Ref | FnGetAtt)[])[] }

export type StringType = string | Ref | FnGetAtt | FnJoin;

export interface Properties {
    [key: string]: any;
}

export interface CommonResource {
    _ID: string;
    _Name: string;
    Type: ResourceType;
    Properties: Properties;
}

export interface Resources {
    [key: LogicalID]: CommonResource;
}

export type CloudFormationTemplate = {
    "AWSTemplateFormatVersion"?: string, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
    "Description"?: string, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-description-structure.html
    "Metadata"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
    "Parameters"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
    "Rules"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/rules-section-structure.html
    "Mappings"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
    "Conditions"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html
    "Transform"?: any, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
    "Resources": Resources, // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
    "Outputs"?: any // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
}

export class RawCloudFormationResourcesCollection {
    private mappedByID: Map<LogicalID, CommonResource>;
    private mappedByType: Map<ResourceType, Set<CommonResource>>;

    constructor() {
        this.mappedByID = new Map<LogicalID, CommonResource>();
        this.mappedByType = new Map<ResourceType, Set<CommonResource>>();
    }

    addResource(key: string, resource: CommonResource) {
        if (isEmptyString(key)) {
            throw new Error("Key is null or empty");
        }
        if (resource === undefined || resource === null) {
            throw new Error("Resource is null or undefined");
        }

        resource._ID = key;
        const resType = resource.Type;
        let resourceName = getNameForResource(resource, key, resType);
        if (isEmptyString(resourceName)) {
            resourceName = key;
        }
        resource._Name = resourceName;


        // Add to the Map of resources with resource ID as a Map Key
        this.mappedByID.set(key, resource);

        // Add resource to the map of resources mapped by resource type
        let setOfRes = this.mappedByType.get(resType);
        if (setOfRes === undefined) {
            setOfRes = new Set<CommonResource>();
        }
        setOfRes.add(resource);
        this.mappedByType.set(resType, setOfRes);
    }

    getResourceById(resourceId: string | undefined): CommonResource | undefined {
        if (resourceId === undefined || resourceId === null || isEmptyString(resourceId)) {
            return undefined;
        }
        return this.mappedByID.get(resourceId);
    }

    getResourcesByType(resourceType: string): CommonResource[] {
        const resources = this.mappedByType.get(resourceType);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources);
    }

    getAllResources(): CommonResource[] {
        return Array.from(this.mappedByID.values());
    }
}

function getNameForResource(resource: CommonResource, resID: string, resType: string): string {
    switch (resType) {
        case AWS_API_GATEWAY_AUTHORIZER: {
            return (resource as AwsApiGatewayAuthorizer).Properties.Name;
        }
        case AWS_API_GATEWAY_MODEL: {
            return (resource as AwsApiGatewayModel).Properties.Name;
        }
        case AWS_API_GATEWAY_REQUEST_VALIDATOR: {
            return (resource as AwsApiGatewayRequestValidator).Properties.Name;
        }
        case AWS_API_GATEWAY_REST_API: {
            return (resource as AwsApiGatewayRestApi).Properties.Name;
        }
        case AWS_DYNAMO_DB_TABLE: {
            return (resource as AwsDynamoDbTable).Properties.TableName;
        }
        case AWS_EVENTS_ARCHIVE: {
            return (resource as AwsEventsArchive).Properties.ArchiveName;
        }
        case AWS_EVENTS_CONNECTION: {
            return (resource as AwsEventsConnection).Properties.Name;
        }
        case AWS_EVENTS_EVENT_BUS: {
            return (resource as AwsEventsEventBus).Properties.Name;
        }
        case AWS_EVENTS_RULE: {
            return (resource as AwsEventsRule).Properties.Name;
        }
        case AWS_LAMBDA_FUNCTION: {
            return (resource as AwsLambdaFunction).Properties.FunctionName;
        }
        case AWS_S3_BUCKET: {
            return (resource as AwsS3Bucket).Properties.BucketName;
        }
        case AWS_SNS_TOPIC: {
            return (resource as AwsSNSTopic).Properties.TopicName;
        }
        case AWS_SQS_QUEUE: {
            return (resource as AwsSQSQueue).Properties.QueueName;
        }
        case AWS_STEP_FUNCTIONS_STATE_MACHINE: {
            return (resource as AwsStepFunctionsStateMachine).Properties.StateMachineName;
        }
        default: {
            return resID;
        }
    }
}