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

    const programmingLang = `Main programming language \-${createStyledText(params.value.programmingLang,
                                                                            MdStyle.BOLD)}`;
    const deploymentDestination = `Deploys to ${createStyledText(params.value.deploymentDestination, MdStyle.BOLD)}`;
    const deploymentTechnology = `Uses \-${createStyledText(params.value.deploymentTechnology,
                                                            MdStyle.BOLD)} as deployment technology`;
    const linkToCloudForge = `${createLink("Cloud Forge page", params.value.linkToCloudForge)}`;

    const list = [programmingLang, deploymentDestination, deploymentTechnology, linkToCloudForge];
    const content = createMdList("", list, MdListType.UNORDERED);

    return createContentBlock("Common Info", MdHeader.HEADER_LEVEL_2, content);
};