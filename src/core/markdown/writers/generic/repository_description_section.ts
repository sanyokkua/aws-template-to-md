import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { mdMakeContentBlock }                    from "../../utils";
import { isEmptyString }                         from "../../../string_utils";
import logger from "../../../../logger";

export const createRepositoryDescriptionSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        logger.debug({}, "createRepositoryDescriptionSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createRepositoryDescriptionSectionText. input values");

    return mdMakeContentBlock(dataValue, "Repository Short Description");
};