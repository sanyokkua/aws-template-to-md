import { Maintainer }                                  from "./customs/models";
import { createContentBlock, createMdTable, MdHeader } from "./common/common_md_functions";

export const writeMaintainers = (maintainers: Maintainer[]): string => {
    if (maintainers === undefined || maintainers.length === 0) {
        return "";
    }

    const HEADER = ["Name", "Link", "Email"];
    const values: string[][] = maintainers.map(maintainer => [maintainer.name, maintainer.link, maintainer.email]);
    const table = createMdTable(HEADER, values);

    return createContentBlock("Maintainers", MdHeader.HEADER_LEVEL_2, table);
};