import { createImageLink, NEW_LINE, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";
import { RepositoryTag }                                                      from "./customs/models";

export const writeTags: WriterFunc<RepositoryTag[]> = (params: WriterParams<RepositoryTag[]>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    const content = params.value.map(tag => {
        if (tag.text !== undefined && tag.text.length > 0 && tag.imgLink !== undefined && tag.imgLink.length > 0) {
            return createImageLink(tag.text, tag.imgLink);
        } else if (tag.linkMd !== undefined && tag.linkMd.length > 0) {
            return tag.linkMd;
        }
        throw new Error("Passed tag object doesn't have appropriate value");
    });
    return content.join(NEW_LINE);
};