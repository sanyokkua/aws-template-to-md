import { AdditionalConfigs, MarkdownWriterFunc }      from "../common";
import { mdCreateTableOfContent, mdMakeContentBlock } from "../../utils";
import { isEmptyString }                              from "../../../string_utils";
import { MDHeader, NEW_LINE }                         from "../../constants";
import { isEmptyArray }                               from "../../../common_utils";

export const TABLE_OF_CONTENT_MARKER_TEXT: string = "$$$TABLE_OF_CONTENT$$$";
export const createTableOfContentSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    return mdMakeContentBlock(TABLE_OF_CONTENT_MARKER_TEXT);
};

export const replaceTableOfContentMarker: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        return "";
    }

    const headers = dataValue.split(NEW_LINE).filter(value => value.startsWith(MDHeader.HEADER_LEVEL_1));
    if (isEmptyArray(headers)) {
        return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, "");
    }

    const tableOfContent = mdCreateTableOfContent(headers);
    if (isEmptyString(tableOfContent)) {
        return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, "");
    }

    return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, tableOfContent);
};