import { ResourcesMappedById, ResourcesMappedByType } from "../../../aws/parser";
import { ApiGatewayRestApi }                          from "../models/models";
import {
    AWS_ApiGateway_Authorizer,
    AWS_ApiGateway_Method,
    AWS_ApiGateway_Resource,
    AWS_ApiGateway_RestApi,
    AWS_ApiGateway_Stage,
}                                                     from "../../../aws/constants";
import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayMethod,
    AwsApiGatewayModel,
    AwsApiGatewayResource,
    AwsApiGatewayRestApi,
    AwsApiGatewayStage,
}                                                     from "../../../aws/models/apigateway/api";
import { fnGetAtt, fnJoin }                           from "../../writers/common/common_parser_utils";
import { Resource }                                   from "../../../aws/models/common";
import { createStyledText, MdStyle }                  from "../../writers/common/common_md_functions";

export function getMappedApiGatewayRestApi(resources: [ResourcesMappedByType, ResourcesMappedById]): ApiGatewayRestApi[] {
    const resourcesByType = resources[0];
    const resourcesById = resources[1];
    const result: ApiGatewayRestApi[] = [];
    const restApis = resourcesByType[AWS_ApiGateway_RestApi];

    if (restApis === undefined || restApis.length === 0) {
        return result;
    }

    for (let i = 0; i < restApis.length; i++) {
        const currentResource: AwsApiGatewayRestApi = restApis[i] as AwsApiGatewayRestApi;

        const foundStages = resourcesByType[AWS_ApiGateway_Stage];
        const stage: AwsApiGatewayStage | undefined = foundStages
            ?.map(resource => {
                return resource as AwsApiGatewayStage;
            })
            ?.find(currentStage => {
                return currentStage.Properties.RestApiId.Ref === currentResource.ID;
            });
        const foundMethods = resourcesByType[AWS_ApiGateway_Method];
        const methods: AwsApiGatewayMethod[] = foundMethods
            ?.map(resource => {
                return resource as AwsApiGatewayMethod;
            })
            ?.filter(currentMethod => {
                return currentMethod.Properties.RestApiId.Ref === currentResource.ID;
            });
        const foundAuthorizers = resourcesByType[AWS_ApiGateway_Authorizer];
        const authorizer: AwsApiGatewayAuthorizer | undefined = foundAuthorizers
            ?.map(resource => {
                return resource as AwsApiGatewayAuthorizer;
            })
            ?.find(currentStage => {
                return currentStage.Properties.RestApiId.Ref === currentResource.ID;
            });

        const type: string = currentResource.Type;
        const name: string = currentResource.Name;
        const environment: string = stage !== undefined ? stage.Name : "";

        const tracing: boolean = stage !== undefined ? stage.Properties.TracingEnabled : false;
        const methodSettings = stage !== undefined ? stage.Properties.MethodSettings
                                                          .map(settings => {
                                                              return {
                                                                  dataTraceEnabled: settings.DataTraceEnabled,
                                                                  httpMethod: settings.HttpMethod,
                                                                  loggingLevel: settings.LoggingLevel,
                                                                  metricsEnabled: settings.MetricsEnabled,
                                                                  resourcePath: settings.ResourcePath,
                                                              };
                                                          }) : [];

        const endpoints = methods.map(method => {
            let resourceId: string = "";

            if ("Ref" in method.Properties.ResourceId && method.Properties.ResourceId.Ref !== undefined) {
                resourceId = method.Properties.ResourceId.Ref;
            } else if ("Fn::GetAtt" in method.Properties.ResourceId && method.Properties.ResourceId["Fn::GetAtt"] != undefined) {
                const foundId = fnGetAtt(method.Properties.ResourceId, resourcesById)?.ID;
                resourceId = foundId !== undefined ? foundId : "";
            }

            const resources: AwsApiGatewayResource[] = [];

            const foundResourceFromMapping: Resource = resourcesById[resourceId];
            let lastResource = foundResourceFromMapping.Type === AWS_ApiGateway_Resource ?
                               foundResourceFromMapping as AwsApiGatewayResource : undefined;

            if (lastResource !== undefined) {
                resources.push(lastResource);
            }

            while (true) {
                const parentIdNode = lastResource?.Properties?.ParentId;

                let resId: string = "";
                if (parentIdNode !== undefined) {

                    if ("Ref" in parentIdNode && parentIdNode.Ref !== undefined) {
                        resId = parentIdNode.Ref;
                    } else if ("Fn::GetAtt" in parentIdNode && parentIdNode["Fn::GetAtt"] != undefined) {
                        const foundId = fnGetAtt(parentIdNode, resourcesById)?.ID;
                        resId = foundId !== undefined ? foundId : "";
                    }

                    if (resId.length > 0) {
                        lastResource = resourcesByType[AWS_ApiGateway_Resource]
                            .map(res => res as AwsApiGatewayResource)
                            .find(res => res.ID === resId);

                        if (lastResource !== undefined) {
                            resources.push(lastResource);
                        }
                    }
                } else {
                    break;
                }
            }

            resources.reverse();

            const url = resources
                .map(res => {
                    return res.Properties.PathPart;
                })
                .join("/");

            let model: string = "";

            if (method.Properties.RequestModels !== undefined && method.Properties.RequestModels["application/json"] !== undefined) {
                const modelId = method.Properties.RequestModels["application/json"].Ref;
                const methodModel = resourcesById[modelId] as AwsApiGatewayModel;
                model = JSON.stringify(methodModel.Properties.Schema);
            }

            // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apitgateway-method-integration.html#cfn-apigateway-method-integration-uri
            // Integration - AWS/AWS_PROXY = arn:aws:apigateway:{region}:{subdomain.service|service}:path|action/{service_api}
            // Integration - HTTP/HTTP_PROXY = https://
            // Integration - VPC_LINK = Network Load Balancer DNS name

            let destination = method.Properties.Integration.Uri !== undefined ?
                              fnJoin(method.Properties.Integration.Uri["Fn::Join"], resourcesById) :
                              "";
            let destinationType: string = "";
            let destinationResource: string = "";

            if (method.Properties.Integration.Type === "AWS" || method.Properties.Integration.Type === "AWS_PROXY") {
                const partsOfDest = destination.split(":");
                // arn 0 aws 1 apigateway 2 {region} 3 {subdomain.service|service} 4 path|action/{service_api} 5
                // arn : aws : apigateway : {region} : {subdomain.service|service} : path|action/{service_api}
                // arn : aws : apigateway : us-east-1: lambda                      : path/2015-03-31/functions/arn:aws:lambda:us-east-1:736352:function:some-lambda-name-environment/invocations

                if (partsOfDest.length > 5) {
                    const dest = destination.split("/");

                    const targetService: string = partsOfDest[4];

                    let targetAction: string = dest[dest.length - 2];
                    let actionHasArn: boolean = targetAction.includes("arn:");
                    if (actionHasArn) {
                        const targetParts = targetAction.split(":");
                        targetAction = targetParts[targetParts.length - 1];
                    }
                    const targetApi: string = dest[dest.length - 1];

                    if (targetService.toLowerCase() === "lambda") {
                        destination = `Lambda ${createStyledText(targetAction, MdStyle.BOLD)}`;
                        destinationType = "Lambda";
                        destinationResource = createStyledText(targetAction, MdStyle.BOLD);
                    } else if (targetService.toLowerCase() === "events") {
                        destination = `AWS EventBus, ${createStyledText(targetApi, MdStyle.BOLD)}`;
                        destinationType = "EventBus";
                        destinationResource = createStyledText("TODO:", MdStyle.BOLD);
                    } else {
                        destination = `AWS Service: ${targetService}, Service Action: ${targetAction}, Service API: ${targetApi}`;
                        destinationType = `${targetService}`;
                        destinationResource = createStyledText(targetApi, MdStyle.BOLD);
                    }
                }
            }

            return {
                url: url,
                method: method.Properties.HttpMethod,
                integrationType: method.Properties.Integration.Type,
                destination: destination,
                destinationType: destinationType,
                destinationResource: destinationResource,
                modelSchema: model,
            };
        });

        const authType = authorizer !== undefined ? authorizer?.Properties.Type : "";
        const apiGateway: ApiGatewayRestApi = {
            id: currentResource.ID,
            type: type,
            name: name,
            environment: environment,
            tracingEnabled: tracing,
            methodSettings: methodSettings,
            endpoints: endpoints,
            authorizer: {type: authType},
        };

        result.push(apiGateway);
    }

    return result;
}