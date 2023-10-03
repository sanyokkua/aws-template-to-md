import { createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { ApiGatewayRestApi, DocumentResourcesTree }            from "../models";

function createApiGatewayDescription(apiGatewayRestApi: ApiGatewayRestApi) {
    const HEADER_LINE: string[] = [
        "Method",
        "Endpoint",
        "Integration Type",
        "Destination",
        "Model Schema",
    ];
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

    const header = makeHeader("Endpoint information:", MdHeader.HEADER_LEVEL_4);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
}

export const writeAwsApiGateways: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const apiGateways = resourcesList.mappedApiGatewayRestApi;
    if (apiGateways === undefined || apiGateways.length === 0) {
        return "";
    }
    const resultText: string[] = [];
    const header = makeHeader("AWS Api Gateway Information", MdHeader.HEADER_LEVEL_2);

    resultText.push(header);

    for (let i = 0; i < apiGateways.length; i++) {
        resultText.push(makeHeader(apiGateways[i].name, MdHeader.HEADER_LEVEL_3));
        resultText.push(createApiGatewayDescription(apiGateways[i]));
    }

    return resultText.join("\n");
};