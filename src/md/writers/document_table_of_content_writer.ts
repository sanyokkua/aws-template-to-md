import {
    createTableOfContent,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
} from "./common/common_md_functions";

export const writeTableOfContent: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }
    const headers = params.value.split(NEW_LINE).filter(value => value.startsWith(MdHeader.HEADER_LEVEL_1));
    return createTableOfContent(headers);
};