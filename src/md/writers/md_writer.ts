import { WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";

export const writeCustomText: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    return params.value;
};