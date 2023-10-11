export const AWS_ApiGateway_Authorizer: string = "AWS::ApiGateway::Authorizer";
export const AWS_ApiGateway_Deployment: string = "AWS::ApiGateway::Deployment";
export const AWS_ApiGateway_GatewayResponse: string = "AWS::ApiGateway::GatewayResponse";
export const AWS_ApiGateway_Method: string = "AWS::ApiGateway::Method";
export const AWS_ApiGateway_Model: string = "AWS::ApiGateway::Model";
export const AWS_ApiGateway_RequestValidator: string = "AWS::ApiGateway::RequestValidator";
export const AWS_ApiGateway_Resource: string = "AWS::ApiGateway::Resource";
export const AWS_ApiGateway_RestApi: string = "AWS::ApiGateway::RestApi";
export const AWS_ApiGateway_Stage: string = "AWS::ApiGateway::Stage";
export const AWS_CDK_Metadata: string = "AWS::CDK::Metadata";
export const AWS_DynamoDB_Table: string = "AWS::DynamoDB::Table";
export const AWS_EC2_SecurityGroup: string = "AWS::EC2::SecurityGroup";
export const AWS_Events_ApiDestination: string = "AWS::Events::ApiDestination";
export const AWS_Events_Archive: string = "AWS::Events::Archive";
export const AWS_Events_Connection: string = "AWS::Events::Connection";
export const AWS_Events_EventBus: string = "AWS::Events::EventBus";
export const AWS_Events_EventBusPolicy: string = "AWS::Events::EventBusPolicy";
export const AWS_Events_Rule: string = "AWS::Events::Rule";
export const AWS_IAM_ManagedPolicy: string = "AWS::IAM::ManagedPolicy";
export const AWS_IAM_Policy: string = "AWS::IAM::Policy";
export const AWS_IAM_Role: string = "AWS::IAM::Role";
export const AWS_Lambda_EventSourceMapping: string = "AWS::Lambda::EventSourceMapping";
export const AWS_Lambda_Function: string = "AWS::Lambda::Function";
export const AWS_Logs_LogGroup: string = "AWS::Logs::LogGroup";
export const AWS_S3_Bucket: string = "AWS::S3::Bucket";
export const AWS_S3_BucketPolicy: string = "AWS::S3::BucketPolicy";
export const AWS_SNS_Subscription: string = "AWS::SNS::Subscription";
export const AWS_SNS_Topic: string = "AWS::SNS::Topic";
export const AWS_SNS_TopicPolicy: string = "AWS::SNS::TopicPolicy";
export const AWS_SQS_Queue: string = "AWS::SQS::Queue";
export const AWS_SQS_QueuePolicy: string = "AWS::SQS::QueuePolicy";
export const AWS_StepFunctions_StateMachine: string = "AWS::StepFunctions::StateMachine";
export const Custom_AWSSecretsManagerStoreSecret: string = "Custom::AWSSecretsManagerStoreSecret";
export const Custom_ApplyTagsToResource: string = "Custom::ApplyTagsToResource";
export const Custom_LogRetention: string = "Custom::LogRetention";
export const Custom_ResourceDNS: string = "Custom::ResourceDNS";
export const Custom_S3BucketNotifications: string = "Custom::S3BucketNotifications";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html
export const AWS_PSEUDO_PARAMS_MAPPING: { [key: string]: string } = {
    "AWS::AccountId": "123456789012",
    "AWS::NoValue": "",
    "AWS::Partition": "aws",
    "AWS::Region": "us-east-1",
    "AWS::StackId": "STACK_ID_MOCK",
    "AWS::URLSuffix": "amazonaws.com",
};