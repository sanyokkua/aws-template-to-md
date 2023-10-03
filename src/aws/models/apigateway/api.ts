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
* */

import { CommonResourceInfo, FnJoinType } from "../common";

export interface AwsApiGatewayAuthorizer extends CommonResourceInfo {
    "Properties": {
        "Name": string,
        "RestApiId": {
            "Ref": string
        },
        "Type": string,
    };
}

export interface AwsApiGatewayGatewayResponse extends CommonResourceInfo {
    "Properties": {
        "ResponseType": string,
        "RestApiId": {
            "Ref": string
        },
        "ResponseTemplates": {
            "application/json": string
        },
        "StatusCode": string
    };
}

export interface AwsApiGatewayMethod extends CommonResourceInfo {
    "Properties": {
        "HttpMethod": string,
        "ResourceId": {
            "Ref": string
        },
        "RestApiId": {
            "Ref": string
        },
        "AuthorizationType": string,
        "AuthorizerId": {
            "Ref": string
        },
        "Integration": {
            "Credentials": {
                "Fn::GetAtt": any[]
            },
            "IntegrationHttpMethod": string,
            "Type": string,
            "Uri": {
                       "Fn::Join": FnJoinType
                   } | undefined
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
            "application/json": {
                "Ref": string;
            }
            [key: string]: any;
        },
        "RequestValidatorId": String,
    };
}

export interface AwsApiGatewayModel extends CommonResourceInfo {
    "Properties": {
        "RestApiId": {
            "Ref": string
        },
        "ContentType": string,
        "Name": string,
        "Schema": any
    },
}

export interface AwsApiGatewayRequestValidator extends CommonResourceInfo {
    "Properties": {
        "RestApiId": {
            "Ref": string
        },
        "Name": string,
        "ValidateRequestBody": boolean,
        "ValidateRequestParameters": boolean
    },
}

export interface AwsApiGatewayResource extends CommonResourceInfo {
    "Properties": {
        "ParentId": {
            "Ref": string;
            "Fn::GetAtt": string[];
        },
        "PathPart": string,
        "RestApiId": {
            "Ref": string
        }
    },
}

export interface AwsApiGatewayRestApi extends CommonResourceInfo {
    "Properties": {
        "EndpointConfiguration": {
            "Types": string[]
        },
        "Name": string,
    },
}

export interface AwsApiGatewayStage extends CommonResourceInfo {
    "Properties": {
        "RestApiId": {
            "Ref": string
        },
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