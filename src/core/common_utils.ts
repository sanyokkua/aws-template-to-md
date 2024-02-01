import logger from "../logger";

export function isEmptyArray(value: undefined | null | any[] | Array<any>): boolean {
    logger.debug(value, "isEmptyArray. Passed value");
    return value === undefined || value === null || value.length === 0;
}