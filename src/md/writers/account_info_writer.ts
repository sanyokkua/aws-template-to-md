import { AccountInfo } from "./customs/models";
import {
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                      from "./common/common_md_functions";

export const writeAccountInfo: WriterFunc<AccountInfo[]> = (params: WriterParams<AccountInfo[]>, options?: WriterOptions): string => {
    if (params.value === undefined || params.value.length === 0) {
        return "";
    }

    const HEADER = ["Organization", "Description", "Account ID"];
    const values: string[][] = params.value.map(acc => [acc.organizationName, acc.description, acc.accountId]);
    const table = createMdTable(HEADER, values);

    return createContentBlock("Aws Accounts And Environments", MdHeader.HEADER_LEVEL_2, table);
};