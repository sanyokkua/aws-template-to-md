import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { mdMakeContentBlock }                    from "../../utils";
import { isEmptyString }                         from "../../../string_utils";

export const createRepositoryDescriptionSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        return "";
    }

    return mdMakeContentBlock(dataValue, "Repository Short Description");
};