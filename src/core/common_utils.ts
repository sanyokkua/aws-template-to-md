export function isEmptyArray(value: undefined | null | any[] | Array<any>): boolean {
    return value === undefined || value === null || value.length === 0;

}