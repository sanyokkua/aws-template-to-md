import { AdditionalConfigs, MarkdownWriterFunc }        from "../common";
import { Project }                                      from "../../../config/models";
import { isEmptyArray }                                 from "../../../common_utils";
import { mdCreateLink, mdMakeContentBlock, mdMakeList } from "../../utils";
import logger                                           from "../../../../logger";

export const createRelatedProjectsSectionText: MarkdownWriterFunc<Project[]> = (dataValue: Project[], additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyArray(dataValue)) {
        logger.debug({}, "createRelatedProjectsSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createRelatedProjectsSectionText. input values");

    const list = dataValue.map(proj => mdCreateLink(proj.projectLink, proj.projectName));
    const content = mdMakeList(list);

    return mdMakeContentBlock(content, "Related Projects");
};