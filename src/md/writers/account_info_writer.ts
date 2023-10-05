import { AccountInfo }                                 from "./customs/models";
import { createContentBlock, createMdTable, MdHeader } from "./common/common_md_functions";

export const writeAccountInfo = (accounts: AccountInfo[]): string => {
    if (accounts === undefined || accounts.length === 0) {
        return "";
    }

    const HEADER = ["Organization", "Description", "Account ID"];
    const values: string[][] = accounts.map(acc => [acc.organizationName, acc.description, acc.accountId]);
    const table = createMdTable(HEADER, values);

    return createContentBlock("Aws Accounts And Environments", MdHeader.HEADER_LEVEL_2, table);
};