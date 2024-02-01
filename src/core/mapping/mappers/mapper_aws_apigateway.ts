import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { AwsApiGatewayEndpoint, MappedApiGatewayRestApi }       from "../models/mapped_aws_apigateway";
import { ParsingOptions }                                       from "../options/parsing_options";
import {
    AWS_API_GATEWAY_AUTHORIZER,
    AWS_API_GATEWAY_METHOD,
    AWS_API_GATEWAY_RESOURCE,
    AWS_API_GATEWAY_REST_API,
    AWS_API_GATEWAY_STAGE,
    AWS_LAMBDA_FUNCTION,
}                                                               from "../../cloudformation/constants";
import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayMethod,
    AwsApiGatewayModel,
    AwsApiGatewayResource,
    AwsApiGatewayRestApi,
    AwsApiGatewayStage,
}                                                               from "../../cloudformation/models/aws_apigateway";
import { getFixedName, getStringValueForField }                 from "../utils/utils";
import { isEmptyString }                                        from "../../string_utils";
import logger from "../../../logger";

interface ParsedArn {
    service: string;
    lambdaIdOrName?: string;
    action?: string;
}

export class MapperApiGatewayRestApi implements Mapper<MappedApiGatewayRestApi> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedApiGatewayRestApi {
        basicResourceValidation(resource, AWS_API_GATEWAY_REST_API);

        const apiGwResource: AwsApiGatewayRestApi = resource as AwsApiGatewayRestApi;
        const apiGwId = apiGwResource._ID;
        const apiGwType: string = apiGwResource.Type;
        const apiGwName: string = getFixedName(apiGwResource._Name, options);

        const apiGwStageObj = this.getStageForApiGateway(rawResourcesCollection, apiGwId);
        const apiGwEnvironment: string = apiGwStageObj?.Properties?.StageName ?? "";
        const apiGwTracing: boolean = apiGwStageObj?.Properties?.TracingEnabled ?? false;

        const apiGwAuthorizerObj = this.getAuthorizersForApiGateway(rawResourcesCollection, apiGwId);
        const apiGwAuthType = apiGwAuthorizerObj?.Properties?.Type ?? "";

        const apiGwEndpointsList: AwsApiGatewayEndpoint[] = this.getEndpoints(apiGwId, rawResourcesCollection, options);
        const apiGwMethodSettings = this.getMethodSettingsForApiGateway(apiGwStageObj);

        return {
            id: apiGwId,
            type: apiGwType,
            name: apiGwName,
            environment: apiGwEnvironment,
            tracingEnabled: apiGwTracing,
            methodSettings: apiGwMethodSettings,
            endpoints: apiGwEndpointsList,
            authorizerType: apiGwAuthType,
        };
    }

    private getStageForApiGateway(rawResourcesCollection: RawCloudFormationResourcesCollection, currentApiGatewayId: string) {
        const allStages: CommonResource[] = rawResourcesCollection.getResourcesByType(AWS_API_GATEWAY_STAGE);
        const mappedStages: AwsApiGatewayStage[] = allStages.map(res => res as AwsApiGatewayStage);
        return mappedStages.find(s => getStringValueForField(s.Properties.RestApiId) === currentApiGatewayId);
    }

    private getAuthorizersForApiGateway(rawResourcesCollection: RawCloudFormationResourcesCollection, currentApiGatewayId: string) {
        const allAuthorizers: CommonResource[] = rawResourcesCollection.getResourcesByType(AWS_API_GATEWAY_AUTHORIZER);
        const mappedAuthorizers: AwsApiGatewayAuthorizer[] = allAuthorizers.map(res => res as AwsApiGatewayAuthorizer);
        return mappedAuthorizers.find(auth => getStringValueForField(auth.Properties.RestApiId) === currentApiGatewayId);
    }

    private getEndpoints(currentApiGatewayId: string, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions) {
        const methods = this.getMethodsForApiGateway(rawResourcesCollection, currentApiGatewayId);
        return methods
            .map(method => this.endpointMapper(method, rawResourcesCollection, options))
            .filter(v => v !== undefined)
            .map(v => v as AwsApiGatewayEndpoint);
    }

    private getMethodsForApiGateway(rawResourcesCollection: RawCloudFormationResourcesCollection, currentApiGatewayId: string) {
        const allMethods: CommonResource[] = rawResourcesCollection.getResourcesByType(AWS_API_GATEWAY_METHOD);
        const mappedMethods: AwsApiGatewayMethod[] = allMethods.map(res => res as AwsApiGatewayMethod);
        return mappedMethods.filter(m => getStringValueForField(m.Properties.RestApiId) === currentApiGatewayId);
    }

    private endpointMapper(method: AwsApiGatewayMethod, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): AwsApiGatewayEndpoint | undefined {
        const urlPath = this.buildUrlPath(method, rawResourcesCollection);

        if (urlPath === undefined) {
            logger.debug({}, "URL Path was not built");
            return undefined;
        }

        const endpointModel = this.getModel(method, rawResourcesCollection);

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apitgateway-method-integration.html#cfn-apigateway-method-integration-uri
        // Integration - AWS/AWS_PROXY = arn:aws:apigateway:{region}:{subdomain.service|service}:path|action/{service_api}
        // Integration - HTTP/HTTP_PROXY = https://
        // Integration - VPC_LINK = Network Load Balancer DNS name
        // Properties.Integration.Type - allowed values: AWS | AWS_PROXY | HTTP | HTTP_PROXY | MOCK

        if (method.Properties.Integration.Type === "MOCK") {
            return {
                url: urlPath,
                method: method.Properties.HttpMethod,
                integrationType: method.Properties.Integration.Type,
                destination: "",
                destinationService: "",
                destinationAction: "",
                modelSchema: endpointModel,
            };
        }

        const integrationUri = getStringValueForField(method.Properties.Integration.Uri);
        const parsedArn = parseAwsArn(integrationUri);

        // Examples of some ARNs:
        // arn:aws:apigateway:us-east-1:states:action/StartExecution
        // arn:aws:apigateway:us-east-1:events:action/PutEvents
        // arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/lambda-name-or-id/invocations

        const service: string = parsedArn.service;
        let serviceAction: string = parsedArn.action ? parsedArn.action : "";
        let destination: string;

        if (method.Properties.Integration.Type === "HTTP" || method.Properties.Integration.Type === "HTTP_PROXY") {
            destination = integrationUri;
        } else {
            switch (service.toLowerCase().trim()) {
                case "lambda": {
                    const lambdaResource = rawResourcesCollection.getResourceById(parsedArn.lambdaIdOrName);
                    if (lambdaResource !== undefined && lambdaResource.Type === AWS_LAMBDA_FUNCTION) {
                        destination = getFixedName(lambdaResource._Name, options);
                    } else {
                        destination = parsedArn.lambdaIdOrName ? parsedArn.lambdaIdOrName : "";
                    }
                    serviceAction = "invoke";
                    break;
                }
                case "states": {
                    destination = "TODO: Add StepFunction";
                    break;
                }
                case "events": {
                    destination = "TODO: Add EventBus";
                    break;
                }
                case "dynamodb": {
                    destination = "TODO: Add DynamoDB";
                    break;
                }
                default: {
                    destination = "TODO: Add Service Name";
                }
            }
        }

        return {
            url: urlPath,
            method: method.Properties.HttpMethod,
            integrationType: method.Properties.Integration.Type,
            destination: destination,
            destinationService: service,
            destinationAction: serviceAction,
            modelSchema: endpointModel,
        };
    }

    private buildUrlPath(method: AwsApiGatewayMethod, rawResourcesCollection: RawCloudFormationResourcesCollection) {
        // Get top Resource for current method with its Path Part
        const topResourceId = getStringValueForField(method.Properties.ResourceId);
        if (topResourceId === undefined || topResourceId === null || isEmptyString(topResourceId)) {
            logger.warn("Something went wrong with getting ResourceID");
            return undefined;
        }

        const resourceById = rawResourcesCollection.getResourceById(topResourceId);
        const topResourceAsCommonResource = resourceById as AwsApiGatewayResource;

        // Get All Resources in the CloudFormation template
        const allApiGWResMapped: AwsApiGatewayResource[] = rawResourcesCollection
            .getResourcesByType(AWS_API_GATEWAY_RESOURCE)
            .map(res => res as AwsApiGatewayResource);

        // Array that will collect all found resources path parts related to this method
        const resourcesForCurrentMethod: string[] = [];

        // Add the first part of the URL to the array (will be the last element in the path)
        if (resourceById !== undefined) {
            resourcesForCurrentMethod.push(topResourceAsCommonResource.Properties.PathPart);
        }

        // Take the ID of the next (previous path part) resource
        let parentResourceId = getStringValueForField(topResourceAsCommonResource?.Properties?.ParentId);
        // Go through all the resources until ParentId will be empty (last element of the path)
        while (parentResourceId.length > 0) {
            const newTopResource = allApiGWResMapped.find(res => res._ID === parentResourceId);
            if (newTopResource !== undefined) {
                resourcesForCurrentMethod.push(newTopResource.Properties.PathPart);
            }
            parentResourceId = getStringValueForField(newTopResource?.Properties?.ParentId);
        }
        // As we started search from the top resource (last item in the path) we need to reverse array to get path from start
        resourcesForCurrentMethod.reverse();

        return resourcesForCurrentMethod.join("/");
    }

    private getModel(method: AwsApiGatewayMethod, rawResourcesCollection: RawCloudFormationResourcesCollection) {
        if (method.Properties.RequestModels !== undefined && method.Properties.RequestModels["application/json"] !== undefined) {
            const modelId = getStringValueForField(method.Properties.RequestModels["application/json"]);
            const methodModel = rawResourcesCollection.getResourceById(modelId) as AwsApiGatewayModel;
            return JSON.stringify(methodModel.Properties.Schema);
        }
        return "";
    }

    private getMethodSettingsForApiGateway(stage: AwsApiGatewayStage | undefined) {
        if (stage === undefined || stage.Properties === undefined ||
            stage.Properties.MethodSettings === undefined || !Array.isArray(stage.Properties.MethodSettings)) {
            return [];
        }

        return stage.Properties.MethodSettings.map(settings => {
            return {
                dataTraceEnabled: settings.DataTraceEnabled,
                httpMethod: settings.HttpMethod,
                loggingLevel: settings.LoggingLevel,
                metricsEnabled: settings.MetricsEnabled,
                resourcePath: settings.ResourcePath,
            };
        });
    }
}

function parseAwsArn(arn: string): ParsedArn {
    if (arn === undefined || arn === null || isEmptyString(arn)) {
        throw new Error(`Passed ARN is undefined or empty`);
    }

    const arnParts = arn.split(":");
    if (arnParts.length < 6) {
        throw new Error(`ARN is not valid - ${arn}`);
    }

    const [service, action] = arnParts.slice(4, 6);
    let lambdaIdOrName: string | undefined;
    if (service === "lambda") {
        // Extract the lambda ID/Name from the ARN
        const functionPathMatch = arn.match(/functions\/([^\/]+)\/invocations/);
        lambdaIdOrName = functionPathMatch ? functionPathMatch[1] : undefined;
    }

    return {service, lambdaIdOrName: lambdaIdOrName, action};
}