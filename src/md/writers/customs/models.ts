export type Maintainer = {
    name: string;
    link: string;
    email: string;
}

export type ArtifactDesign = {
    linkToTheSolutionDiagram: string;
    linkToTheDiagramImage: string;
}

export type RepositoryTag = {
    text?: string | undefined;
    imgLink?: string | undefined;
    linkMd?: string | undefined;
}
export type RepositoryMaintainer = {
    name: string;
    link: string;
    email: string;
}
export type RepositoryInfo = {
    name: string;
    description: string;
    mainProgrammingLanguage: string;
    deploymentDestination: string;
    deploymentTechnology: string;
    deploymentTechnologyDocs: string;
    branchingStrategy: string;
    ciDocumentation: string;
    ciBuildPage: string;
    ciDeployPage: string;
    linkToCloudForge: string;
}
export type Account = {
    name: string;
    description: string;
    accountId: string;
    accountUrl?: string;
}

export type ParserConfig = {
    templateResourceNamePrefixToRemove: string;
    templateResourceNameSuffixToRemove: string;
    enableStepFunctionDefinition: boolean;
    enableLambdaEnvVarValues: boolean;
    enableDynamoDbExampleStubs: boolean;
}

export type OtherAppConfig = {
    enableArchitectureDiagramImgLinkTemplate: boolean;
    enableStepFunctionDiagramLinkTemplate: boolean;
    showOpenApiStub: boolean;
    showApiGatewayUsageInstructionStub: boolean;
    showPostmanStub: boolean;
    showPostmanSecretsLink: boolean;
    showApiMaintainerColumn: boolean;
    showApiDocsLinkColumn: boolean;
    selectedWriters: string[];
}

export type Project = {
    projectName: string;
    projectLink: string;
}

export type RelatedProjects = {
    projects: Project[]
}

export type ParserParameters = {
    templateJsonValue: string;
    parserConfig: ParserConfig;
    repositoryTags: RepositoryTag[];
    repositoryInformation: RepositoryInfo;
    repositoryMaintainers: RepositoryMaintainer[];
    accountsInformation: Account[];
    artifactDesign: ArtifactDesign,
    additionalMarkdownContent: string;
    otherAppConfig: OtherAppConfig;
    relatedProjects: RelatedProjects;
}

export type EditorInput<T> = {
    data: T;
    onDataChanged: (data: T) => void;
}
