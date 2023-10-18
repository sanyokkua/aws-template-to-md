import { NEW_LINE, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";

export const writeCustomText: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    return `${NEW_LINE}${params.value}`;
};