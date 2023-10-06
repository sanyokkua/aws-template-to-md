import { NEW_LINE, WriterFunc, WriterOptions, WriterParams } from "./common/common_md_functions";

export const TABLE_OF_CONTENT_MARKER_TEXT: string = "$$$TABLE_OF_CONTENT$$$";
export const writeTableOfContentMarker: WriterFunc<string> = (params: WriterParams<string>, options?: WriterOptions): string => {
    return `${NEW_LINE}${TABLE_OF_CONTENT_MARKER_TEXT}${NEW_LINE}`;
};