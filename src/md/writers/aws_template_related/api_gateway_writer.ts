import {
    createContentBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                   from "../common/common_md_functions";
import { ApiGatewayRestApi, DocumentResourcesTree } from "../../models/models";

function createApiGatewayEndpointsTable(apiGatewayRestApi: ApiGatewayRestApi) {
    const HEADER_LINE: string[] = ["Method", "Endpoint", "Integration Type", "Destination", "Model Schema"];
    const tableValues: string[][] = [];

    apiGatewayRestApi.endpoints.forEach(endpoint => {
        tableValues.push([
                             endpoint.method !== undefined ? endpoint.method : "",
                             endpoint.url !== undefined ? endpoint.url : "",
                             endpoint.integrationType !== undefined ? endpoint.integrationType : "",
                             endpoint.destination !== undefined ? endpoint.destination : "",
                             endpoint.modelSchema !== undefined ? endpoint.modelSchema : "",
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

function createApiGatewayTextContent(apiGateways: ApiGatewayRestApi[]): string {
    const resultText: string[] = [];

    apiGateways.forEach(apiGateway => {
        const content = createApiGatewayEndpointsTable(apiGateway);
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