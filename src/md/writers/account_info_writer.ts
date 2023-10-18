import { Account } from "./customs/models";
import {
    createContentBlock,
    createLink,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                  from "./common/common_md_functions";

export const writeAccountInfo: WriterFunc<Account[]> = (params: WriterParams<Account[]>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    const HEADER = ["Name", "Description", "Account ID"];
    const values: string[][] = params.value.map(acc => {
        let accountId: string;
        if (acc.accountUrl !== undefined && acc.accountUrl.trim().length > 0) {
            accountId = createLink(acc.accountId, acc.accountUrl);
        } else {
            accountId = acc.accountId;
        }
        return [acc.name, acc.description, accountId];
    });
    const table = createMdTable(HEADER, values);

    return createContentBlock("Artifact Environments", MdHeader.HEADER_LEVEL_2, table);
};