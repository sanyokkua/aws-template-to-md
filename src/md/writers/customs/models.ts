export type Tag = {
    text: string;
    imgLink: string;
}
export type RepositoryName = {
    name: string;
}
export type Maintainer = {
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
export type AccountInfo = {
    organizationName: string;
    description: string;
    accountId: string;
}
export type CustomMdText = {
    mdText: string;
}