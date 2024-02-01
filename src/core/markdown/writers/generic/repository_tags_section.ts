import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { RepositoryTag }                         from "../../../config/models";
import { isEmptyArray }                          from "../../../common_utils";
import { isEmptyString }                         from "../../../string_utils";
import { mdCreateImageLink, mdMakeContentBlock } from "../../utils";
import { NEW_LINE }                              from "../../constants";
import logger from "../../../../logger";

export const createRepositoryTagsSectionText: MarkdownWriterFunc<RepositoryTag[]> = (dataValue: RepositoryTag[], additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyArray(dataValue)) {
        logger.debug({}, "createRepositoryTagsSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createRepositoryTagsSectionText. input values");

    const content = dataValue.map(tag => {
        if (!isEmptyString(tag.text) && !isEmptyString(tag.imgUrl)) {
            return mdCreateImageLink(tag.imgUrl!, tag.text!);
        } else if (!isEmptyString(tag.imgMd)) {
            return tag.imgMd;
        }
        throw new Error("Passed tag object doesn't have appropriate value");
    });

    return mdMakeContentBlock(content.join(NEW_LINE));
};