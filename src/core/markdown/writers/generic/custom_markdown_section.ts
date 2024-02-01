import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { isEmptyString }                         from "../../../string_utils";
import { mdMakeContentBlock }                    from "../../utils";
import logger from "../../../../logger";


export const createCustomMarkdownSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        logger.debug({}, "createCustomMarkdownSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createCustomMarkdownSectionText. input values");

    return mdMakeContentBlock(dataValue);
};