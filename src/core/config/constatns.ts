import {
    AccountInformation,
    DesignInformation,
    OtherAppConfiguration,
    ParserConfig,
    ParsingConfiguration,
    Project,
    RepositoryInfo,
    RepositoryMaintainer,
    RepositoryTag,
} from "./models";

export const PARSER_CONFIGURATION: string = "ParserConfig";
export const REPOSITORY_CONFIGURATION: string = "RepositoryInfo";
export const REPOSITORY_TAGS_CONFIGURATION: string = "RepositoryTags";
export const REPOSITORY_MAINTAINERS_CONFIGURATION: string = "RepositoryMaintainers";
export const ACCOUNTS_CONFIGURATION: string = "Accounts";
export const DESIGN_CONFIGURATION: string = "Design";
export const RELATED_PROJECTS_CONFIGURATION: string = "RelatedProjects";
export const CUSTOM_MARKDOWN_TEXT_CONFIGURATION: string = "CustomMD";
export const OTHER_APP_CONFIG: string = "OtherAppConfig";
export const AVAILABLE_APP_CONFIGURATORS: string[] = [
    PARSER_CONFIGURATION,
    REPOSITORY_CONFIGURATION,
    REPOSITORY_TAGS_CONFIGURATION,
    REPOSITORY_MAINTAINERS_CONFIGURATION,
    ACCOUNTS_CONFIGURATION,
    DESIGN_CONFIGURATION,
    RELATED_PROJECTS_CONFIGURATION,
    CUSTOM_MARKDOWN_TEXT_CONFIGURATION,
    OTHER_APP_CONFIG,
];
export const REPOSITORY_NAME: string = "Repository Name";
export const REPOSITORY_TAGS: string = "Repository Tags";
export const REPOSITORY_DESCRIPTION: string = "Repository Description";
export const TABLE_OF_CONTENT: string = "Table Of Content";
export const REPOSITORY_MAINTAINERS: string = "Repository Maintainers";
export const ESSENTIAL_REPOSITORY_INFORMATION: string = "Essential Repository Information";
export const ENVIRONMENTS: string = "Environments";
export const DESIGN: string = "Design";
export const RELATED_PROJECTS: string = "Related Projects";
export const AMOUNT_OF_AWS_RESOURCES: string = "Amount of AWS Resources";
export const MAIN_AWS_RESOURCES_DIAGRAM: string = "Main AWS Resources (diagram)";
export const API_GATEWAY: string = "API Gateway";
export const EVENT_BUS: string = "Event Bus";
export const EVENT_RULES: string = "Event Rules";
export const DYNAMO_DB: string = "DynamoDB";
export const LAMBDA: string = "Lambda";
export const SQS: string = "SQS";
export const SNS: string = "SNS";
export const STATE_MACHINE: string = "State Machine";
export const S3: string = "S3";
export const CUSTOMS: string = "Customs";
export const AVAILABLE_MARKDOWN_DOC_SECTIONS: string[] = [
    REPOSITORY_NAME,
    REPOSITORY_TAGS,
    REPOSITORY_DESCRIPTION,
    TABLE_OF_CONTENT,
    REPOSITORY_MAINTAINERS,
    ESSENTIAL_REPOSITORY_INFORMATION,
    ENVIRONMENTS,
    DESIGN,
    RELATED_PROJECTS,
    AMOUNT_OF_AWS_RESOURCES,
    MAIN_AWS_RESOURCES_DIAGRAM,
    API_GATEWAY,
    EVENT_BUS,
    EVENT_RULES,
    DYNAMO_DB,
    LAMBDA,
    SQS,
    SNS,
    STATE_MACHINE,
    S3,
    CUSTOMS,
];
export const DEFAULT_PARSER_CONFIG: ParserConfig = {
    prefixToRemove: "",
    suffixToRemove: "",
    replaceOriginalValue: "",
    replaceToValue: "",
};
export const DEFAULT_REPOSITORY_INFO: RepositoryInfo = {
    repositoryName: "",
    repositoryDescription: "",
    branchingStrategy: "",
    programmingLang: "",
    programmingLangDoc: "",
    deploymentDestination: "",
    deploymentTechnology: "",
    deploymentTechnologyDocs: "",
    linkToCloudForge: "",
    ciCdTechnology: "",
    ciCdDocumentation: "",
    ciCdBuildPage: "",
    ciCdDeployPage: "",
};
export const DEFAULT_REPOSITORY_TAGS_LIST: RepositoryTag[] = [];
export const DEFAULT_REPOSITORY_MAINTAINERS_LIST: RepositoryMaintainer[] = [];
export const DEFAULT_ACCOUNT_INFORMATION_LIST: AccountInformation[] = [];
export const DEFAULT_DESIGN_INFORMATION: DesignInformation = {
    solutionDiagramUrl: "",
    solutionDiagramImageUrl: "",
};
export const DEFAULT_RELATED_PROJECTS_LIST: Project[] = [];
export const DEFAULT_CUSTOM_MARKDOWN_TEXT: string = "";
export const DEFAULT_OTHER_APP_CONFIGURATION: OtherAppConfiguration = {
    showStepFunctionDefinition: false,
    showStepFunctionSteps: true,
    showLambdaVars: true,
    showLambdaVarsValues: false,
    showApiGatewayEndpointMaintainerColumn: true,
    showApiGatewayEndpointDocsLinkColumn: true,

    addDynamoDbExamplesStub: true,
    addDesignLinkStub: true,
    addStepFunctionDesignImgStub: true,
    addOpenApiLinkStub: true,
    addApiGatewayUsageInstructionStub: true,
    addPostmanLinkStub: true,
    addPostmanSecretsLinkStub: true,

    selectedMarkdownSections: AVAILABLE_MARKDOWN_DOC_SECTIONS,
};
export const DefaultParsingConfiguration: ParsingConfiguration = {
    parserConfig: DEFAULT_PARSER_CONFIG,
    repositoryInfo: DEFAULT_REPOSITORY_INFO,
    repositoryTags: DEFAULT_REPOSITORY_TAGS_LIST,
    repositoryMaintainers: DEFAULT_REPOSITORY_MAINTAINERS_LIST,
    designInformation: DEFAULT_DESIGN_INFORMATION,
    accountInformationList: DEFAULT_ACCOUNT_INFORMATION_LIST,
    relatedProjects: DEFAULT_RELATED_PROJECTS_LIST,
    customMarkdownText: DEFAULT_CUSTOM_MARKDOWN_TEXT,
    otherAppConfiguration: DEFAULT_OTHER_APP_CONFIGURATION,
};