import { Maintainer } from "./customs/models";
import {
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                     from "./common/common_md_functions";

export const writeMaintainers: WriterFunc<Maintainer[]> = (params: WriterParams<Maintainer[]>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    const HEADER = ["Name", "Link", "Email"];
    const values: string[][] = params.value.map(maintainer => [maintainer.name, maintainer.link, maintainer.email]);
    const table = createMdTable(HEADER, values);

    return createContentBlock("Repository Maintainers", MdHeader.HEADER_LEVEL_2, table);
};