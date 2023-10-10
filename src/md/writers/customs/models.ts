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
    text: string;
    imgLink: string;
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
    linkToCloudForge: string;
}
export type Account = {
    organizationName: string;
    description: string;
    accountId: string;
}

export type ParserConfig = {
    templateResourceNamePrefixToRemove: string;
    templateResourceNameSuffixToRemove: string;
    enableStepFunctionDefinition: boolean;
    enableLambdaEnvVarValues: boolean;
}

export type OtherAppConfig = {
    enableArchitectureDiagramImgLinkTemplate: boolean;
    enableStepFunctionDiagramLinkTemplate: boolean;
    selectedWriters: string[];
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
}