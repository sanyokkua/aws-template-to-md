import { AdditionalConfigs, MarkdownWriterFunc }      from "../common";
import { mdCreateTableOfContent, mdMakeContentBlock } from "../../utils";
import { isEmptyString }                              from "../../../string_utils";
import { MDHeader, NEW_LINE }                         from "../../constants";
import { isEmptyArray }                               from "../../../common_utils";
import logger from "../../../../logger";

export const TABLE_OF_CONTENT_MARKER_TEXT: string = "$$$TABLE_OF_CONTENT$$$";
export const createTableOfContentSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    logger.debug({dataValue, additionalConfigs},
                 "createTableOfContentSectionText. Will be returned MARKER for table of content");
    return mdMakeContentBlock(TABLE_OF_CONTENT_MARKER_TEXT);
};

export const replaceTableOfContentMarker: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        logger.debug({}, "replaceTableOfContentMarker. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "replaceTableOfContentMarker. input values");

    const headers = dataValue.split(NEW_LINE).filter(value => value.startsWith(MDHeader.HEADER_LEVEL_1));
    if (isEmptyArray(headers)) {
        logger.debug({}, "replaceTableOfContentMarker. headers list is empty, only marker will be removed");
        return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, "");
    }

    const tableOfContent = mdCreateTableOfContent(headers);
    if (isEmptyString(tableOfContent)) {
        logger.debug({}, "replaceTableOfContentMarker. tableOfContent is empty, only marker will be removed");
        return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, "");
    }

    logger.debug(tableOfContent, "replaceTableOfContentMarker. tableOfContent was generated");
    return dataValue.replace(TABLE_OF_CONTENT_MARKER_TEXT, tableOfContent);
};