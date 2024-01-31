import { AdditionalConfigs, MarkdownWriterFunc }        from "../common";
import { Project }                                      from "../../../config/models";
import { isEmptyArray }                                 from "../../../common_utils";
import { mdCreateLink, mdMakeContentBlock, mdMakeList } from "../../utils";

export const createRelatedProjectsSectionText: MarkdownWriterFunc<Project[]> = (dataValue: Project[], additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyArray(dataValue)) {
        return "";
    }

    const list = dataValue.map(proj => mdCreateLink(proj.projectLink, proj.projectName));
    const content = mdMakeList(list);

    return mdMakeContentBlock(content, "Related Projects");
};