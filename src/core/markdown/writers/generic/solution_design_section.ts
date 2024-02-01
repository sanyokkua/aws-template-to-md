import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DesignInformation }                     from "../../../config/models";

import { mdCreateImageLink, mdCreateLink, mdMakeContentBlock } from "../../utils";
import { NEW_LINE }                                            from "../../constants";
import logger from "../../../../logger";

export const createSolutionDesignSectionText: MarkdownWriterFunc<DesignInformation> = (dataValue: DesignInformation, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createSolutionDesignSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createSolutionDesignSectionText. input values");

    const solutionDiagramLink = mdCreateLink(dataValue.solutionDiagramUrl, "link");
    const content = [
        `By the following ${solutionDiagramLink} can be found diagram of the whole solution.${NEW_LINE}`,
        mdCreateImageLink(dataValue.solutionDiagramImageUrl, "Diagram of the current artifact"),
    ];

    return mdMakeContentBlock(content.join(NEW_LINE), "Artifact Design");

};