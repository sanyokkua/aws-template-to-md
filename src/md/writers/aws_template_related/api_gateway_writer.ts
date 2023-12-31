import {
    CodeSyntax,
    createContentBlock,
    createLink,
    createMdCodeBlock,
    createMdList,
    createMdTable,
    MdHeader,
    MdListType,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                   from "../common/common_md_functions";
import { ApiGatewayRestApi, DocumentResourcesTree } from "../../mapper/models/models";

function createApiGatewayEndpointsTable(apiGatewayRestApi: ApiGatewayRestApi, options: WriterOptions | undefined) {
    let showMaintainers: boolean = false;
    let showApiDocsLink: boolean = false;
    if (options !== undefined) {
        if ("showApiMaintainerColumn" in options && options["showApiMaintainerColumn"]) {
            showMaintainers = options["showApiMaintainerColumn"];
        }
        if ("showApiDocsLinkColumn" in options && options["showApiDocsLinkColumn"]) {
            showApiDocsLink = options["showApiDocsLinkColumn"];
        }
    }
    const HEADER_LINE: string[] = [];
    if (showMaintainers) {
        HEADER_LINE.push("Maintainer");
    }
    HEADER_LINE.push("Method");
    HEADER_LINE.push("Endpoint");
    HEADER_LINE.push("Integration Type");
    HEADER_LINE.push("Destination Type");
    HEADER_LINE.push("Destination Resource");
    if (showApiDocsLink) {
        HEADER_LINE.push("Documentation");
    }

    const tableValues: string[][] = [];

    apiGatewayRestApi.endpoints.forEach(endpoint => {
        const values: string[] = [];
        if (showMaintainers) {
            values.push("TODO:");
        }
        values.push(endpoint.method !== undefined ? endpoint.method : "");
        values.push(endpoint.url !== undefined ? endpoint.url : "");
        values.push(endpoint.integrationType !== undefined ? endpoint.integrationType : "");
        values.push(endpoint.destination !== undefined ? endpoint.destinationType : "");
        values.push(endpoint.destination !== undefined ? endpoint.destinationResource : "");
        if (showApiDocsLink) {
            values.push(createLink("Docs", "TODO:"));
        }
        tableValues.push(values);
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

function createApiGatewayTextContent(apiGateways: ApiGatewayRestApi[], options?: WriterOptions): string {
    const resultText: string[] = [];

    apiGateways.forEach(apiGateway => {
        const contentData: string[] = [];

        contentData.push(createApiGatewayEndpointsTable(apiGateway, options));
        contentData.push(createModelSchemaBlocks(apiGateway));

        if (options !== undefined) {
            const links: string[] = [];
            if ("showOpenApiStub" in options && options["showOpenApiStub"]) {
                links.push(createLink("Open API Specification", "TODO"));
            }
            if ("showApiGatewayUsageInstructionStub" in options && options["showApiGatewayUsageInstructionStub"]) {
                links.push(createLink("API Gateway Usage Instruction", "TODO"));
            }
            if ("showPostmanStub" in options && options["showPostmanStub"]) {
                links.push(createLink("Postman Collection", "TODO"));
            }
            if ("showPostmanSecretsLink" in options && options["showPostmanSecretsLink"]) {
                links.push(createLink("Postman Collection Secrets", "TODO"));
            }
            const res = createMdList("Useful Links", links, MdListType.UNORDERED, MdHeader.HEADER_LEVEL_4);
            if (res !== undefined && res.length > 0) {
                contentData.push(res);
            }
        }

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

    const content = createApiGatewayTextContent(apiGateways, options);
    return createContentBlock("AWS Api Gateway Information", MdHeader.HEADER_LEVEL_2, content);

};