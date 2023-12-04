import {
    createContentBlock,
    createImageLink,
    createLink,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                         from "./common/common_md_functions";
import { ArtifactDesign } from "./customs/models";

export const writeArtifactDesign: WriterFunc<ArtifactDesign> = (params: WriterParams<ArtifactDesign>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.linkToTheDiagramImage.length === 0) {
        return "";
    }

    const content = [
        `By the following ${createLink("link",
                                       params.value.linkToTheSolutionDiagram)} can be found diagram of the whole solution.${NEW_LINE}`,
        createImageLink("Diagram of the current artifact", params.value.linkToTheDiagramImage),
    ];

    return createContentBlock("Artifact Design Description", MdHeader.HEADER_LEVEL_2, content.join(NEW_LINE));
};