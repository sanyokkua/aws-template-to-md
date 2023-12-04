import copy from "copy-to-clipboard";

export function copyToClipboard(text: string | null | undefined): boolean {
    const textToCopy: string = text ? text : "";
    return copy(textToCopy);
}

export async function getFromClipboard(): Promise<string> {
    try {
        return await navigator.clipboard.readText();
    } catch (e) {
        console.warn(e);
        return "";
    }
}

export function removePrefix(originalValue: string, prefix: string): string {
    if (prefix === undefined || prefix.length === 0) {
        return originalValue;
    }
    if (originalValue.startsWith(prefix)) {
        return originalValue.slice(prefix.length);
    } else {
        return originalValue;
    }
}

export function removeSuffix(originalValue: string, suffix: string): string {
    if (suffix === undefined || suffix.length === 0) {
        return originalValue;
    }
    if (originalValue.endsWith(suffix)) {
        return originalValue.slice(0, -suffix.length);
    } else {
        return originalValue;
    }
}

export function getCurrentOrDefault<T>(value: T | undefined, defaultValue: T): T {
    if (value === undefined) {
        return defaultValue;
    }
    return value;
}

export function isEmptyString(value: undefined | null | string): boolean {
    return value === undefined || value === null || value.trim().length === 0;
}