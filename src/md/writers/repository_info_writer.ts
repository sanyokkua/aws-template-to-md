import { RepositoryInfo } from "./customs/models";
import {
    createContentBlock,
    createLink,
    createMdList,
    createStyledText,
    MdHeader,
    MdListType,
    MdStyle,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                         from "./common/common_md_functions";

export const writeRepositoryCommonInfo: WriterFunc<RepositoryInfo> = (params: WriterParams<RepositoryInfo>, options?: WriterOptions): string => {
    if (params.value === undefined) {
        return "";
    }

    const mainProgrammingLanguage: string = params.value.mainProgrammingLanguage;
    const destination: string = params.value.deploymentDestination;
    const technology: string = params.value.deploymentTechnology;
    const cloudForge: string = params.value.linkToCloudForge;
    const deploymentTechnologyDocs: string = params.value.deploymentTechnologyDocs;
    const branchingStrategy: string = params.value.branchingStrategy;
    const ciDocumentation: string = params.value.ciDocumentation;
    const ciBuildPage: string = params.value.ciBuildPage;
    const ciDeployPage: string = params.value.ciDeployPage;

    if (mainProgrammingLanguage.length === 0 || destination.length === 0 || technology.length === 0 || cloudForge.length === 0 ||
        deploymentTechnologyDocs.length === 0 ||
        branchingStrategy.length === 0 ||
        ciDocumentation.length === 0 ||
        ciBuildPage.length === 0 ||
        ciDeployPage.length === 0
    ) {
        return "";
    }

    const branchingStrategyValue = `Branching Strategy can be found ${createLink("here", branchingStrategy)}`;
    const programmingLang = `Main programming language: ${createStyledText(mainProgrammingLanguage, MdStyle.BOLD)}`;
    const deploymentDestination = `Artifact is deployed to: ${createStyledText(destination, MdStyle.BOLD)}`;
    const deploymentTechnology = `Infrastructure Definition Technology: ${createLink(technology,
                                                                                     deploymentTechnologyDocs)}`;
    const ciDocumentationValue = `Repository CI/CD Tool Documentation can be found ${createLink("here",
                                                                                                ciDocumentation)}`;
    const ciBuildPageValue = `${createLink("CI/CD Build Pipeline Page", ciBuildPage)}`;
    const ciDeployPageValue = `${createLink("CI/CD Deployment Pipeline Page", ciDeployPage)}`;
    const linkToCloudForge = `${createLink("Cloud Forge page", cloudForge)}`;

    const list = [
        branchingStrategyValue,
        programmingLang,
        deploymentDestination,
        deploymentTechnology,
        ciDocumentationValue,
        ciBuildPageValue,
        ciDeployPageValue,
        linkToCloudForge,
    ];
    const content = createMdList("", list, MdListType.UNORDERED);

    return createContentBlock("Essential Repository Information", MdHeader.HEADER_LEVEL_2, content);
};