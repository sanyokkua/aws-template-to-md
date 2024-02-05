export type ParserConfig = {
    prefixToRemove?: string;
    suffixToRemove?: string;
    replaceOriginalValue?: string;
    replaceToValue?: string;
}
export type RepositoryInfo = {
    repositoryName: string;
    repositoryDescription: string;
    branchingStrategy: string;
    programmingLang: string;
    programmingLangDoc: string;
    deploymentDestination: string;
    deploymentTechnology: string;
    deploymentTechnologyDocs: string;
    linkToCloudForge: string;
    ciCdTechnology: string;
    ciCdDocumentation: string;
    ciCdBuildPage: string;
    ciCdDeployPage: string;
}
export type RepositoryTag = {
    text?: string;
    imgUrl?: string;
    imgMd?: string;
}
export type RepositoryMaintainer = {
    name: string;
    link: string;
    email: string;
}
export type DesignInformation = {
    solutionDiagramUrl: string;
    solutionDiagramImageUrl: string;
}
export type AccountInformation = {
    name: string;
    description: string;
    accountId: string;
    accountUrl?: string;
}
export type Project = {
    projectName: string;
    projectLink: string;
}
export type OtherAppConfiguration = {
    showStepFunctionDefinition: boolean;
    showStepFunctionSteps: boolean;
    showLambdaVars: boolean;
    showLambdaVarsValues: boolean;
    showApiGatewayEndpointMaintainerColumn: boolean;
    showApiGatewayEndpointDocsLinkColumn: boolean;
    showStepFunctionStepsDetails: boolean;

    addDynamoDbExamplesStub: boolean;
    addDesignLinkStub: boolean;
    addStepFunctionDesignImgStub: boolean;
    addOpenApiLinkStub: boolean;
    addApiGatewayUsageInstructionStub: boolean;
    addPostmanLinkStub: boolean;
    addPostmanSecretsLinkStub: boolean;

    selectedMarkdownSections: string[];
}
export type ParsingConfiguration = {
    parserConfig: ParserConfig;
    repositoryInfo: RepositoryInfo;
    repositoryTags: RepositoryTag[];
    repositoryMaintainers: RepositoryMaintainer[];
    designInformation: DesignInformation;
    accountInformationList: AccountInformation[];
    relatedProjects: Project[];
    customMarkdownText: string;
    otherAppConfiguration: OtherAppConfiguration;
}