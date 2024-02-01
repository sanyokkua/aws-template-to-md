import { AdditionalConfigs, MarkdownWriterFunc }                                      from "../common";
import {
    DocumentResourcesTree,
}                                                                                     from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                                                               from "../../../common_utils";
import { DEFAULT_OTHER_APP_CONFIGURATION }                                            from "../../../config/constatns";
import {
    AwsApiGatewayEndpoint,
    MappedApiGatewayRestApi,
}                                                                                     from "../../../mapping/models/mapped_aws_apigateway";
import { MDCodeSyntax, MDHeader, MDListType, NEW_LINE }                               from "../../constants";
import { mdCreateLink, mdMakeCodeBlock, mdMakeContentBlock, mdMakeList, mdMakeTable } from "../../utils";
import { isEmptyString }                                                              from "../../../string_utils";
import logger from "../../../../logger";

export const SHOW_API_GATEWAY_ENDPOINT_MAINTAINER_COLUMN = "showApiGatewayEndpointMaintainerColumn";
export const SHOW_API_GATEWAY_ENDPOINT_DOCS_LINK_COLUMN = "showApiGatewayEndpointDocsLinkColumn";
export const ADD_API_GATEWAY_USAGE_INSTRUCTION_STUB = "addApiGatewayUsageInstructionStub";
export const ADD_OPEN_API_LINK_STUB = "addOpenApiLinkStub";
export const ADD_POSTMAN_LINK_STUB = "addPostmanLinkStub";
export const ADD_POSTMAN_SECRETS_LINK_STUB = "addPostmanSecretsLinkStub";

type Configuration = {
    showApiGatewayEndpointMaintainerColumn: boolean;
    showApiGatewayEndpointDocsLinkColumn: boolean;
    addApiGatewayUsageInstructionStub: boolean;
    addOpenApiLinkStub: boolean;
    addPostmanLinkStub: boolean;
    addPostmanSecretsLinkStub: boolean;
}

export const createAwsApiGatewaysSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({dataValue, additionalConfigs},
                     "createAwsApiGatewaysSectionText. passed dataValue is null, empty string will be returned");
        return "";
    }

    const restApis = dataValue.getMappedApiGatewayRestApi();
    if (isEmptyArray(restApis)) {
        logger.debug({}, "createAwsApiGatewaysSectionText. restApis is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsApiGatewaysSectionText. input values");

    let showApiGatewayEndpointMaintainerColumn: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showApiGatewayEndpointMaintainerColumn;
    let showApiGatewayEndpointDocsLinkColumn: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showApiGatewayEndpointDocsLinkColumn;
    let addApiGatewayUsageInstructionStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addApiGatewayUsageInstructionStub;
    let addOpenApiLinkStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addOpenApiLinkStub;
    let addPostmanLinkStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addPostmanLinkStub;
    let addPostmanSecretsLinkStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addPostmanSecretsLinkStub;

    if (additionalConfigs !== undefined) {
        showApiGatewayEndpointMaintainerColumn = additionalConfigs[SHOW_API_GATEWAY_ENDPOINT_MAINTAINER_COLUMN] ?? showApiGatewayEndpointMaintainerColumn;
        showApiGatewayEndpointDocsLinkColumn = additionalConfigs[SHOW_API_GATEWAY_ENDPOINT_DOCS_LINK_COLUMN] ?? showApiGatewayEndpointDocsLinkColumn;
        addApiGatewayUsageInstructionStub = additionalConfigs[ADD_API_GATEWAY_USAGE_INSTRUCTION_STUB] ?? addApiGatewayUsageInstructionStub;
        addOpenApiLinkStub = additionalConfigs[ADD_OPEN_API_LINK_STUB] ?? addOpenApiLinkStub;
        addPostmanLinkStub = additionalConfigs[ADD_POSTMAN_LINK_STUB] ?? addPostmanLinkStub;
        addPostmanSecretsLinkStub = additionalConfigs[ADD_POSTMAN_SECRETS_LINK_STUB] ?? addPostmanSecretsLinkStub;
    }

    const configuration: Configuration = {
        showApiGatewayEndpointMaintainerColumn,
        showApiGatewayEndpointDocsLinkColumn,
        addApiGatewayUsageInstructionStub,
        addOpenApiLinkStub,
        addPostmanLinkStub,
        addPostmanSecretsLinkStub,
    };

    return createMarkdownContent(restApis, configuration);
};

function createMarkdownContent(restApis: MappedApiGatewayRestApi[], configuration: Configuration) {
    const restApisDescriptions = restApis.map(restApi => createRestApiMarkdownDescription(restApi, configuration));
    const content = restApisDescriptions.join(NEW_LINE);
    return mdMakeContentBlock(content, "AWS Api Gateway Information");
}

function createRestApiMarkdownDescription(restApi: MappedApiGatewayRestApi, configuration: Configuration): string {
    const contentData: string[] = [];

    contentData.push(createApiGatewayEndpointsTable(restApi, configuration));
    contentData.push(createModelSchemaBlocks(restApi));

    const usefulLinksList = createUsefulLinksMdList(configuration);

    if (!isEmptyString(usefulLinksList)) {
        contentData.push(usefulLinksList);
    }

    const content = contentData.join(NEW_LINE);

    return mdMakeContentBlock(content, restApi.name, MDHeader.HEADER_LEVEL_3);
}

function createApiGatewayEndpointsTable(restApi: MappedApiGatewayRestApi, configuration: Configuration) {
    const showMaintainers: boolean = configuration.showApiGatewayEndpointMaintainerColumn;
    const showApiDocsLink: boolean = configuration.showApiGatewayEndpointDocsLinkColumn;

    const headerLine: string[] = [];
    if (showMaintainers) {
        headerLine.push("Maintainer");
    }
    headerLine.push("Method");
    headerLine.push("Endpoint");
    headerLine.push("Integration Type");
    headerLine.push("Destination");
    headerLine.push("Destination Service");
    headerLine.push("Destination Action");
    if (showApiDocsLink) {
        headerLine.push("Documentation");
    }

    const tableValues: string[][] = [];

    for (const endpoint of restApi.endpoints) {
        const values: string[] = [];
        if (showMaintainers) {
            values.push("TODO:");
        }
        values.push(endpoint?.method ?? "");
        values.push(endpoint?.url ?? "");
        values.push(endpoint?.integrationType ?? "");
        values.push(endpoint?.destination ?? "");
        values.push(endpoint?.destinationService ?? "");
        values.push(endpoint?.destinationAction ?? "");
        if (showApiDocsLink) {
            values.push(mdCreateLink("TODO:", "Docs"));
        }
        tableValues.push(values);
    }

    return mdMakeTable(headerLine, tableValues);
}

function createModelSchemaBlocks(restApi: MappedApiGatewayRestApi) {
    const contentData: string[] = [];

    for (const endpoint of restApi.endpoints) {
        const modelSchemaCodeBlockText = getModelSchemaCodeBlockForEndpoint(endpoint);
        if (!isEmptyString(modelSchemaCodeBlockText)) {
            const content = mdMakeContentBlock(modelSchemaCodeBlockText,
                                               `Model Schema for: ${endpoint.url}`, MDHeader.HEADER_LEVEL_4);
            contentData.push(content);
        }
    }

    return !isEmptyArray(contentData) ? contentData.join(NEW_LINE) : "";
}

function getModelSchemaCodeBlockForEndpoint(endpoint: AwsApiGatewayEndpoint) {
    let modelSchemaCodeBlockText: string = "";
    if (!isEmptyString(endpoint?.modelSchema)) {
        try {
            const modelJsonObj = JSON.parse(endpoint.modelSchema);
            const prettyJsonString = JSON.stringify(modelJsonObj, null, 2);
            modelSchemaCodeBlockText = mdMakeCodeBlock(prettyJsonString, MDCodeSyntax.JSON);
        } catch (e) {
            modelSchemaCodeBlockText = mdMakeCodeBlock(endpoint.modelSchema, MDCodeSyntax.JSON);
        }
    }
    return modelSchemaCodeBlockText;
}

function createUsefulLinksMdList(configuration: Configuration) {
    const usefulLinks: string[] = [];

    if (configuration.addOpenApiLinkStub) {
        usefulLinks.push(mdCreateLink("TODO", "Open API Specification"));
    }
    if (configuration.addApiGatewayUsageInstructionStub) {
        usefulLinks.push(mdCreateLink("TODO", "API Gateway Usage Instruction"));
    }
    if (configuration.addPostmanLinkStub) {
        usefulLinks.push(mdCreateLink("TODO", "Postman Collection"));
    }
    if (configuration.addPostmanSecretsLinkStub) {
        usefulLinks.push(mdCreateLink("TODO", "Postman Collection Secrets"));
    }

    return mdMakeList(usefulLinks, "Useful Links", MDListType.UNORDERED, MDHeader.HEADER_LEVEL_4);
}
