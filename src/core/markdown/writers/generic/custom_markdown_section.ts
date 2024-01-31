import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { isEmptyString }                         from "../../../string_utils";
import { mdMakeContentBlock }                    from "../../utils";


export const createCustomMarkdownSectionText: MarkdownWriterFunc<string> = (dataValue: string, additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyString(dataValue)) {
        return "";
    }

    return mdMakeContentBlock(dataValue);
};