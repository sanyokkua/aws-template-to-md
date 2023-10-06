export type Tag = {
    text: string;
    imgLink: string;
}
export type Maintainer = {
    name: string;
    link: string;
    email: string;
}
export type AccountInfo = {
    organizationName: string;
    description: string;
    accountId: string;
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
    programmingLang: string;
    deploymentDestination: string;
    deploymentTechnology: string;
    linkToCloudForge: string;
}
export type Account = {
    organizationName: string;
    description: string;
    accountId: string;
}

export type ParserParameters = {
    templateJsonValue: string;
    templateResourceNamePrefixToRemove: string;
    templateResourceNameSuffixToRemove: string;
    enableArchitectureDiagramImgLinkTemplate: boolean;
    enableStepFunctionDefinition: boolean;
    enableStepFunctionDiagramLinkTemplate: boolean;
    enableLambdaEnvVarValues: boolean;
    repositoryName: string;
    repositoryDescription: string;
    repositoryTags: RepositoryTag[];
    repositoryInformation: RepositoryInfo;
    repositoryMaintainers: RepositoryMaintainer[];
    accountsInformation: Account[];
    artifactDesign: ArtifactDesign,
    additionalMarkdownContent: string;
    selectedWritersNames: string[];
}