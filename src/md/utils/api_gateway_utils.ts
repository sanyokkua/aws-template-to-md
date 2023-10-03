import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import {
    ApiGatewayRestApi,
}                                                     from "../models";
import {
    AWS_ApiGateway_Authorizer,
    AWS_ApiGateway_Method,
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
import {
    fnJoin,
}                                                     from "../common_utils";

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
        const environment: string = stage !== undefined ? stage.Properties.StageName : "";
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
            const resourceId = method.Properties.ResourceId.Ref;
            const resources: AwsApiGatewayResource[] = [];
            let lastResource = resourcesById[resourceId] as AwsApiGatewayResource;
            resources.push(lastResource);

            while (true) {
                const parentIdNode = lastResource.Properties.ParentId;
                if (parentIdNode.Ref !== undefined && parentIdNode.Ref.length > 0) {
                    lastResource = resourcesById[parentIdNode.Ref] as AwsApiGatewayResource;
                    resources.push(lastResource);
                    continue;
                }
                break;
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