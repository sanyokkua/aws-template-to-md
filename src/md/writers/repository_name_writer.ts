import { createContentBlock, MdHeader, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";

export const writeRepositoryName: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {

    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    return createContentBlock(params.value, MdHeader.HEADER_LEVEL_1, "");
};