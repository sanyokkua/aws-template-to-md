import {
    CodeSyntax,
    createContentBlock,
    createMdCodeBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                   from "../common/common_md_functions";
import { ApiGatewayRestApi, DocumentResourcesTree } from "../../mapper/models/models";

function createApiGatewayEndpointsTable(apiGatewayRestApi: ApiGatewayRestApi) {
    const HEADER_LINE: string[] = ["Method", "Endpoint", "Integration Type", "Destination"];
    const tableValues: string[][] = [];

    apiGatewayRestApi.endpoints.forEach(endpoint => {
        tableValues.push([
                             endpoint.method !== undefined ? endpoint.method : "",
                             endpoint.url !== undefined ? endpoint.url : "",
                             endpoint.integrationType !== undefined ? endpoint.integrationType : "",
                             endpoint.destination !== undefined ? endpoint.destination : "",
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

function createModelSchemaBlocks(apiGateway: ApiGatewayRestApi) {
    const contentData: string[] = [];

    apiGateway.endpoints.forEach(endpoint => {
        let modelSchema: string = "";
        if (endpoint.modelSchema != undefined && endpoint.modelSchema.length > 0) {
            try {
                const json = JSON.parse(endpoint.modelSchema);
                const pretty = JSON.stringify(json, null, 2);
                modelSchema = createMdCodeBlock(pretty, CodeSyntax.JSON);
            } catch (e) {
                modelSchema = createMdCodeBlock(endpoint.modelSchema, CodeSyntax.JSON);
            }
            if (modelSchema.length > 0) {
                const content = createContentBlock(`Model Schema for: ${endpoint.url}`,
                                                   MdHeader.HEADER_LEVEL_4,
                                                   modelSchema);
                contentData.push(content);
            }
        }
    });

    return contentData.length > 0 ? contentData.join(NEW_LINE) : "";
}

function createApiGatewayTextContent(apiGateways: ApiGatewayRestApi[]): string {
    const resultText: string[] = [];

    apiGateways.forEach(apiGateway => {
        const contentData: string[] = [];

        contentData.push(createApiGatewayEndpointsTable(apiGateway));
        contentData.push(createModelSchemaBlocks(apiGateway));

        const content = contentData.join(NEW_LINE);

        resultText.push(createContentBlock(apiGateway.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultText.join(NEW_LINE);
}

export const writeAwsApiGateways: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const apiGateways = params.value.mappedApiGatewayRestApi;
    if (apiGateways === undefined || apiGateways.length === 0) {
        return "";
    }

    const content = createApiGatewayTextContent(apiGateways);
    return createContentBlock("AWS Api Gateway Information", MdHeader.HEADER_LEVEL_2, content);

};