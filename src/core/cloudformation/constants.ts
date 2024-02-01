export const AWS_API_GATEWAY_AUTHORIZER: string = "AWS::ApiGateway::Authorizer";
export const AWS_API_GATEWAY_METHOD: string = "AWS::ApiGateway::Method";
export const AWS_API_GATEWAY_MODEL: string = "AWS::ApiGateway::Model";
export const AWS_API_GATEWAY_REQUEST_VALIDATOR: string = "AWS::ApiGateway::RequestValidator";
export const AWS_API_GATEWAY_RESOURCE: string = "AWS::ApiGateway::Resource";
export const AWS_API_GATEWAY_REST_API: string = "AWS::ApiGateway::RestApi";
export const AWS_API_GATEWAY_STAGE: string = "AWS::ApiGateway::Stage";
export const AWS_DYNAMO_DB_TABLE: string = "AWS::DynamoDB::Table";
export const AWS_EVENTS_ARCHIVE: string = "AWS::Events::Archive";
export const AWS_EVENTS_CONNECTION: string = "AWS::Events::Connection";
export const AWS_EVENTS_EVENT_BUS: string = "AWS::Events::EventBus";
export const AWS_EVENTS_RULE: string = "AWS::Events::Rule";
export const AWS_LAMBDA_FUNCTION: string = "AWS::Lambda::Function";
export const AWS_S3_BUCKET: string = "AWS::S3::Bucket";
export const AWS_SNS_SUBSCRIPTION: string = "AWS::SNS::Subscription";
export const AWS_SNS_TOPIC: string = "AWS::SNS::Topic";
export const AWS_SQS_QUEUE: string = "AWS::SQS::Queue";
export const AWS_STEP_FUNCTIONS_STATE_MACHINE: string = "AWS::StepFunctions::StateMachine";

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