import { saveAs }        from "file-saver";
import { isEmptyString } from "./string_utils";
import logger            from "../logger";

export function saveTextAsFile(content: string, fileName: string = "new_file.txt"): void {
    logger.debug({content, fileName}, "saveTextAsFile. Passed values");
    if (isEmptyString(content)) {
        logger.error({}, "saveTextAsFile. No content to save");
        throw Error("Nothing to save, check console for details");
    }

    const blob = new Blob([content], {type: "text/plain"});
    saveAs(blob, fileName);
    logger.debug({blob, fileName}, "saveTextAsFile. Values used to create file");
}