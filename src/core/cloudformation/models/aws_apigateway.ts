import { CommonResource, StringType } from "./common_models";


// "AWS::ApiGateway::Authorizer"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html
export interface AwsApiGatewayAuthorizer extends CommonResource {
    "Properties": {
        "RestApiId": StringType,
        "Name": string,
        "Type": string,
    };
}


// "AWS::ApiGateway::GatewayResponse"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-gatewayresponse.html
export interface AwsApiGatewayGatewayResponse extends CommonResource {
    "Properties": {
        "RestApiId": StringType,
        "ResponseType": string,
        "ResponseTemplates": {
            "application/json": string
        },
        "StatusCode": string
    };
}

// "AWS::ApiGateway::Method"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html
export interface AwsApiGatewayMethod extends CommonResource {
    "Properties": {
        "HttpMethod": string,
        "ResourceId": StringType,
        "RestApiId": StringType,
        "AuthorizationType": string,
        "AuthorizerId": StringType,
        "Integration": {
            "Credentials": {
                "Fn::GetAtt": any[]
            },
            "IntegrationHttpMethod": string,
            "Type": string,
            "Uri": StringType
        },
        "RequestParameters": {
            "method.request.querystring.sourceSystemUserId": boolean,
            "method.request.querystring.sourceSystemCode": boolean,
            "method.request.querystring.domainType": boolean,
            "method.request.querystring.pageSize": boolean
        },

        "ApiKeyRequired": boolean,
        "AuthorizationScopes": string[],
        "MethodResponses": {
            "ResponseModels": {},
            "ResponseParameters": {},
            "StatusCode": String
        }[],
        "OperationName": String,
        "RequestModels": {
            "application/json": StringType
            [key: string]: any;
        },
        "RequestValidatorId": String,
    };
}

// "AWS::ApiGateway::Model"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-model.html
export interface AwsApiGatewayModel extends CommonResource {
    "Properties": {
        "RestApiId": StringType,
        "ContentType": string,
        "Name": string,
        "Schema": any
    },
}

// "AWS::ApiGateway::RequestValidator"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-requestvalidator.html
export interface AwsApiGatewayRequestValidator extends CommonResource {
    "Properties": {
        "RestApiId": StringType,
        "Name": string,
        "ValidateRequestBody": boolean,
        "ValidateRequestParameters": boolean
    },
}

// "AWS::ApiGateway::Resource"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html
export interface AwsApiGatewayResource extends CommonResource {
    "Properties": {
        "ParentId": StringType,
        "PathPart": string,
        "RestApiId": StringType
    },
}

// "AWS::ApiGateway::RestApi"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html
export interface AwsApiGatewayRestApi extends CommonResource {
    "Properties": {
        "EndpointConfiguration": {
            "Types": string[]
        },
        "Name": string,
    },
}

// "AWS::ApiGateway::Stage"
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-stage.html
export interface AwsApiGatewayStage extends CommonResource {
    "Properties": {
        "RestApiId": StringType,
        "MethodSettings":
            {
                "DataTraceEnabled": boolean,
                "HttpMethod": string,
                "LoggingLevel": string,
                "MetricsEnabled": boolean,
                "ResourcePath": string
            }[],
        "StageName": string,
        "TracingEnabled": boolean
    },
}