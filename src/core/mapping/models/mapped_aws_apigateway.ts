import { CommonMappedResource } from "./mapped_common";

export interface AwsApiGatewayMethodSettings {
    dataTraceEnabled: boolean,    // AwsApiGatewayStage.Properties.MethodSettings.DataTraceEnabled
    httpMethod: string,   // AwsApiGatewayStage.Properties.MethodSettings.HttpMethod
    loggingLevel: string, // AwsApiGatewayStage.Properties.MethodSettings.LoggingLevel
    metricsEnabled: boolean,  // AwsApiGatewayStage.Properties.MethodSettings.MetricsEnabled
    resourcePath: string  // AwsApiGatewayStage.Properties.MethodSettings.ResourcePath
}

export interface AwsApiGatewayEndpoint {
    url: string; // Build based on the AwsApiGatewayResource.Properties.PathPart
    method: string; // AwsApiGatewayMethod.Properties.HttpMethod
    integrationType: string; // AwsApiGatewayMethod.Properties.Integration.Type
    destination: string; // Should be built by joining of AwsApiGatewayMethod.Properties.Integration.Uri
    destinationService: string; // Should be built by joining of AwsApiGatewayMethod.Properties.Integration.Uri
    destinationAction: string; // Should be built by joining of AwsApiGatewayMethod.Properties.Integration.Uri
    modelSchema: string; // AwsApiGatewayMethod.Properties.* There is a ref to AwsApiGatewayModel.Properties.Schema
}

export interface MappedApiGatewayRestApi extends CommonMappedResource {
    environment: string; // AwsApiGatewayStage.Properties.StageName
    tracingEnabled: boolean; // AwsApiGatewayStage.Properties.TracingEnabled
    methodSettings: AwsApiGatewayMethodSettings[];
    endpoints: AwsApiGatewayEndpoint[];
    authorizerType: string; // AwsApiGatewayAuthorizer.Properties.Type
}