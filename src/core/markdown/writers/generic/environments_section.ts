import { AdditionalConfigs, MarkdownWriterFunc }         from "../common";
import { AccountInformation }                            from "../../../config/models";
import { isEmptyArray }                                  from "../../../common_utils";
import { isEmptyString }                                 from "../../../string_utils";
import { mdCreateLink, mdMakeContentBlock, mdMakeTable } from "../../utils";
import logger from "../../../../logger";

export const createAccountInformationSectionText: MarkdownWriterFunc<AccountInformation[]> = (dataValue: AccountInformation[], additionalConfigs?: AdditionalConfigs): string => {
    if (isEmptyArray(dataValue)) {
        logger.debug({}, "createAccountInformationSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAccountInformationSectionText. input values");

    const header = ["Name", "Description", "Account ID"];
    const values: string[][] = dataValue.map(accountInfo => {
        let accountId: string;
        if (!isEmptyString(accountInfo.accountUrl)) {
            accountId = mdCreateLink(accountInfo.accountUrl!, accountInfo.accountId);
        } else {
            accountId = accountInfo.accountId;
        }

        return [accountInfo.name, accountInfo.description, accountId];
    });
    const table = mdMakeTable(header, values);

    return mdMakeContentBlock(table, "Artifact Environments");
};