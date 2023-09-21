import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayGatewayResponse,
    AwsApiGatewayMethod,
    AwsApiGatewayModel,
    AwsApiGatewayRequestValidator,
    AwsApiGatewayResource,
    AwsApiGatewayRestApi,
    AwsApiGatewayStage,
}                                                             from "./apigateway/api";
import { AwsDynamoDbTable }                                   from "./dynamodb/dynamodb";
import {
    AwsEventsApiDestination,
    AwsEventsArchive,
    AwsEventsConnection,
    AwsEventsEventBus,
    AwsEventsEventBusPolicy,
    AwsEventsRule,
}                                                             from "./events/eventbus";
import { AwsLambdaEventSourceMapping, AwsLambdaFunction }     from "./lambda/lambda";
import { AwsS3Bucket, AwsS3BucketPolicy }                     from "./s3/s3";
import { AwsSNSSubscription, AwsSNSTopic, AwsSNSTopicPolicy } from "./sns/sns";
import { AwsSQSQueue, AwsSQSQueuePolicy }                     from "./sqs/sqs";
import { AwsStepFunctionsStateMachine }                       from "./stepfunction/stepfunction";

export interface CommonResourceInfo {
    ID: string;
    Type: string;
    Name: string;

    [key: string]: any;
}

export type Resource =
    AwsApiGatewayAuthorizer |
    AwsApiGatewayGatewayResponse |
    AwsApiGatewayMethod |
    AwsApiGatewayModel |
    AwsApiGatewayRequestValidator |
    AwsApiGatewayResource |
    AwsApiGatewayRestApi |
    AwsApiGatewayStage |
    AwsDynamoDbTable |
    AwsEventsApiDestination |
    AwsEventsArchive |
    AwsEventsConnection |
    AwsEventsEventBus |
    AwsEventsEventBusPolicy |
    AwsEventsRule |
    AwsLambdaEventSourceMapping |
    AwsLambdaFunction |
    AwsS3Bucket |
    AwsS3BucketPolicy |
    AwsSNSSubscription |
    AwsSNSTopic |
    AwsSNSTopicPolicy |
    AwsSQSQueue |
    AwsSQSQueuePolicy |
    AwsStepFunctionsStateMachine |
    CommonResourceInfo;

export type FnGetAtt = { "Fn::GetAtt": string[] };
export type FnJoinType = (string | (string | { "Ref": string } | FnGetAtt)[]) [];

export type CloudForgeTemplate = {
    Resources: {
        [key: string]: Resource
    }
    Parameters: any
    Rules: any
}