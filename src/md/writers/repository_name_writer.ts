import { RepositoryName }               from "./customs/models";
import { createContentBlock, MdHeader } from "./common/common_md_functions";

export const writeRepositoryName = (tags: RepositoryName): string => {
    if (tags === undefined || tags.name.length === 0) {
        return "";
    }

    return createContentBlock(tags.name, MdHeader.HEADER_LEVEL_1, "");
};