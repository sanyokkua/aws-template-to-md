import { createImageLink, NEW_LINE, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";
import { RepositoryTag }                                                      from "./customs/models";

export const writeTags: WriterFunc<RepositoryTag[]> = (params: WriterParams<RepositoryTag[]>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    const content = params.value.map(tag => createImageLink(tag.text, tag.imgLink));
    return content.join(NEW_LINE);
};