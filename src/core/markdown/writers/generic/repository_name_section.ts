import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { isEmptyString }                         from "../../../string_utils";
import { mdMakeContentBlock }                    from "../../utils";
import { MDHeader }                              from "../../constants";
import logger                                    from "../../../../logger";

export const createRepositoryNameSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        logger.debug({}, "createRepositoryNameSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createRepositoryNameSectionText. input values");

    return mdMakeContentBlock("", dataValue, MDHeader.HEADER_LEVEL_1);
};