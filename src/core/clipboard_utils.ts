import copy   from "copy-to-clipboard";
import logger from "../logger";

export function copyToClipboard(text: string | null | undefined): boolean {
    logger.debug(text, "copyToClipboard. text that passed to be copied");
    const textToCopy: string = text ? text : "";
    logger.debug(textToCopy, "copyToClipboard. text that should will be copied");
    return copy(textToCopy);
}

export async function pasteFromClipboard(): Promise<string> {
    try {
        return await navigator.clipboard.readText();
    } catch (e) {
        logger.warn(e, "pasteFromClipboard failed");
        return "";
    }
}