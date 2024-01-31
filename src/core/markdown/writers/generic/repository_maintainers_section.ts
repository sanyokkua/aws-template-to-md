import { AdditionalConfigs, MarkdownWriterFunc }         from "../common";
import { RepositoryMaintainer }                          from "../../../config/models";
import { isEmptyArray }                                  from "../../../common_utils";
import { mdCreateLink, mdMakeContentBlock, mdMakeTable } from "../../utils";

export const createRepositoryMaintainersSectionText: MarkdownWriterFunc<RepositoryMaintainer[]> = (dataValue: RepositoryMaintainer[], additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyArray(dataValue)) {
        return "";
    }

    const header = ["Name", "Link", "Email"];
    const values: string[][] = dataValue.map(maintainer => [
        maintainer.name,
        mdCreateLink(maintainer.link, maintainer.link),
        maintainer.email,
    ]);
    const table = mdMakeTable(header, values);

    return mdMakeContentBlock(table, "Repository Maintainers");
};