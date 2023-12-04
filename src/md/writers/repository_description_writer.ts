import { createContentBlock, MdHeader, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";

export const writeRepositoryDescription: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    return createContentBlock("Repository Short Description", MdHeader.HEADER_LEVEL_2, params.value);
};