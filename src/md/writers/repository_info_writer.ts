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

    const mainProgrammingLanguage = params.value.mainProgrammingLanguage;
    const destination = params.value.deploymentDestination;
    const technology = params.value.deploymentTechnology;
    const cloudForge = params.value.linkToCloudForge;

    if (mainProgrammingLanguage.length === 0 || destination.length === 0 || technology.length === 0 || cloudForge.length === 0) {
        return "";
    }

    const programmingLang = `Main programming language \- ${createStyledText(mainProgrammingLanguage, MdStyle.BOLD)}`;
    const deploymentDestination = `Deploys to ${createStyledText(destination, MdStyle.BOLD)}`;
    const deploymentTechnology = `Uses \- ${createStyledText(technology, MdStyle.BOLD)} as deployment technology`;
    const linkToCloudForge = `${createLink("Cloud Forge page", cloudForge)}`;

    const list = [programmingLang, deploymentDestination, deploymentTechnology, linkToCloudForge];
    const content = createMdList("", list, MdListType.UNORDERED);

    return createContentBlock("Common Info", MdHeader.HEADER_LEVEL_2, content);
};