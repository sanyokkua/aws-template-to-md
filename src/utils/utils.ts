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