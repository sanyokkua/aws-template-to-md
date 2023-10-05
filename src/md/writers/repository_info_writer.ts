import { RepositoryInfo } from "./customs/models";
import {
    createContentBlock,
    createLink,
    createMdList,
    createStyledText,
    MdHeader,
    MdListType,
    MdStyle,
}                         from "./common/common_md_functions";

export const writeRepositoryCommonInfo = (repositoryInfos: RepositoryInfo): string => {
    if (repositoryInfos === undefined) {
        return "";
    }

    const programmingLang = `Main programming language \-${createStyledText(repositoryInfos.programmingLang,
                                                                            MdStyle.BOLD)}`;
    const deploymentDestination = `Deploys to ${createStyledText(repositoryInfos.deploymentDestination, MdStyle.BOLD)}`;
    const deploymentTechnology = `Uses \-${createStyledText(repositoryInfos.deploymentTechnology,
                                                            MdStyle.BOLD)} as deployment technology`;
    const linkToCloudForge = `${createLink("Cloud Forge page", repositoryInfos.linkToCloudForge)}`;

    const list = [programmingLang, deploymentDestination, deploymentTechnology, linkToCloudForge];
    const content = createMdList("", list, MdListType.UNORDERED);

    return createContentBlock("Common Info", MdHeader.HEADER_LEVEL_2, content);
};