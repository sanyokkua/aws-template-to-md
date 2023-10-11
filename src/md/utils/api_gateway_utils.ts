import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { ApiGatewayRestApi }                          from "../models/models";
import {
    AWS_ApiGateway_Authorizer,
    AWS_ApiGateway_Method,
    AWS_ApiGateway_Resource,
    AWS_ApiGateway_RestApi,
    AWS_ApiGateway_Stage,
}                                                     from "../../aws/constants";
import {
    AwsApiGatewayAuthorizer,
    AwsApiGatewayMethod,
    AwsApiGatewayModel,
    AwsApiGatewayResource,
    AwsApiGatewayRestApi,
    AwsApiGatewayStage,
}                                                     from "../../aws/models/apigateway/api";
import { fnGetAtt, fnJoin }                           from "../writers/common/common_parser_utils";
import { Resource }                                   from "../../aws/models/common";

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

        const stage: AwsApiGatewayStage | undefined = resourcesByType[AWS_ApiGateway_Stage]
            .map(resource => {
                return resource as AwsApiGatewayStage;
            })
            .find(currentStage => {
                return currentStage.Properties.RestApiId.Ref === currentResource.ID;
            });
        const methods: AwsApiGatewayMethod[] = resourcesByType[AWS_ApiGateway_Method]
            .map(resource => {
                return resource as AwsApiGatewayMethod;
            })
            .filter(currentMethod => {
                return currentMethod.Properties.RestApiId.Ref === currentResource.ID;
            });
        const authorizer: AwsApiGatewayAuthorizer | undefined = resourcesByType[AWS_ApiGateway_Authorizer]
            .map(resource => {
                return resource as AwsApiGatewayAuthorizer;
            })
            .find(currentStage => {
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

            const destination = method.Properties.Integration.Uri !== undefined ?
                                fnJoin(method.Properties.Integration.Uri["Fn::Join"], resourcesById) :
                                "";

            return {
                url: url,
                method: method.Properties.HttpMethod,
                integrationType: method.Properties.Integration.Type,
                destination: destination,
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