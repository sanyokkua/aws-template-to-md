import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { isEmptyString }                         from "../../../string_utils";
import { mdMakeContentBlock }                    from "../../utils";
import { MDHeader }                              from "../../constants";

export const createRepositoryNameSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        return "";
    }

    return mdMakeContentBlock("", dataValue, MDHeader.HEADER_LEVEL_1);
};