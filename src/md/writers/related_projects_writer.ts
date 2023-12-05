import { RelatedProjects } from "./customs/models";
import {
    createContentBlock,
    createLink,
    createMdList,
    MdHeader,
    MdListType,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                          from "./common/common_md_functions";

export const writeRelatedProjects: WriterFunc<RelatedProjects> = (params: WriterParams<RelatedProjects>, options?: WriterOptions): string => {
    if (params.value === undefined) {
        return "";
    }
    const list = params.value.projects.map(proj => createLink(proj.projectName, proj.projectLink));
    const content = createMdList("", list, MdListType.UNORDERED);

    return createContentBlock("Related Projects", MdHeader.HEADER_LEVEL_2, content);
};