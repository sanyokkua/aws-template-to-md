export const AWS_API_GATEWAY_AUTHORIZER: string = "AWS::ApiGateway::Authorizer";
export const AWS_API_GATEWAY_DEPLOYMENT: string = "AWS::ApiGateway::Deployment"; // TODO - remove
export const AWS_API_GATEWAY_GATEWAY_RESPONSE: string = "AWS::ApiGateway::GatewayResponse";
export const AWS_API_GATEWAY_METHOD: string = "AWS::ApiGateway::Method";
export const AWS_API_GATEWAY_MODEL: string = "AWS::ApiGateway::Model";
export const AWS_API_GATEWAY_REQUEST_VALIDATOR: string = "AWS::ApiGateway::RequestValidator";
export const AWS_API_GATEWAY_RESOURCE: string = "AWS::ApiGateway::Resource";
export const AWS_API_GATEWAY_REST_API: string = "AWS::ApiGateway::RestApi";
export const AWS_API_GATEWAY_STAGE: string = "AWS::ApiGateway::Stage";


export const AWS_DYNAMO_DB_TABLE: string = "AWS::DynamoDB::Table";


export const AWS_EVENTS_API_DESTINATION: string = "AWS::Events::ApiDestination";
export const AWS_EVENTS_ARCHIVE: string = "AWS::Events::Archive";
export const AWS_EVENTS_CONNECTION: string = "AWS::Events::Connection";
export const AWS_EVENTS_EVENT_BUS: string = "AWS::Events::EventBus";
export const AWS_EVENTS_EVENT_BUS_POLICY: string = "AWS::Events::EventBusPolicy";
export const AWS_EVENTS_RULE: string = "AWS::Events::Rule";


export const AWS_LAMBDA_EVENT_SOURCE_MAPPING: string = "AWS::Lambda::EventSourceMapping";
export const AWS_LAMBDA_FUNCTION: string = "AWS::Lambda::Function";


export const AWS_S3_BUCKET: string = "AWS::S3::Bucket";
export const AWS_S3_BUCKET_POLICY: string = "AWS::S3::BucketPolicy";


export const AWS_SNS_SUBSCRIPTION: string = "AWS::SNS::Subscription";
export const AWS_SNS_TOPIC: string = "AWS::SNS::Topic";
export const AWS_SNS_TOPIC_POLICY: string = "AWS::SNS::TopicPolicy";


export const AWS_SQS_QUEUE: string = "AWS::SQS::Queue";
export const AWS_SQS_QUEUE_POLICY: string = "AWS::SQS::QueuePolicy";


export const AWS_STEP_FUNCTIONS_STATE_MACHINE: string = "AWS::StepFunctions::StateMachine";


export const AWS_LOGS_LOG_GROUP: string = "AWS::Logs::LogGroup";
export const AWS_IAM_MANAGED_POLICY: string = "AWS::IAM::ManagedPolicy";
export const AWS_IAM_POLICY: string = "AWS::IAM::Policy";
export const AWS_IAM_ROLE: string = "AWS::IAM::Role";
export const AWS_CDK_METADATA: string = "AWS::CDK::Metadata";
export const AWS_EC_2_SECURITY_GROUP: string = "AWS::EC2::SecurityGroup";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html
// Pseudo parameters are parameters that are predefined by AWS CloudFormation.
// You don't declare them in your template.
// Use them the same way as you would a parameter, as the argument for the Ref function.
export const AWS_PSEUDO_PARAMS_MAPPING: { [key: string]: string } = {
    "AWS::AccountId": "123456789012",
    "AWS::NoValue": "",
    "AWS::Partition": "aws",
    "AWS::Region": "us-east-1",
    "AWS::StackId": "STACK_ID_MOCK",
    "AWS::URLSuffix": "amazonaws.com",
};