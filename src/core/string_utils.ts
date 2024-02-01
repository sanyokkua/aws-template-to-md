import logger from "../logger";

export function isEmptyString(value: undefined | null | string): boolean {
    logger.debug(value, "isEmptyString. Input value");
    return value === undefined || value === null || value.trim().length === 0;
}

export function removePrefix(originalValue: string, prefix: string): string {
    logger.debug({originalValue, prefix}, "removePrefix. Input value");
    if (isEmptyString(prefix)) {
        return originalValue;
    }
    if (originalValue.startsWith(prefix)) {
        return originalValue.slice(prefix.length);
    } else {
        return originalValue;
    }
}

export function removeSuffix(originalValue: string, suffix: string): string {
    logger.debug({originalValue, suffix}, "removeSuffix. Input value");
    if (isEmptyString(suffix)) {
        return originalValue;
    }
    if (originalValue.endsWith(suffix)) {
        return originalValue.slice(0, -suffix.length);
    } else {
        return originalValue;
    }
}

export function replaceSubstring(originalString: string, substringToReplace: string, replacementValue: string): string {
    logger.debug({originalString, substringToReplace, replacementValue}, "replaceSubstring. Input value");
    return originalString.replace(new RegExp(substringToReplace, "g"), replacementValue);
}

export function isArn(input: string | null | undefined): boolean {
    logger.debug(input, "isArn. Input value");
    if (!input) {
        return false;
    }

    const arnRegex = /^arn:aws:[a-z0-9\-]*:[a-z0-9\-]*:[a-z0-9\-]*:\d{12}:.*$/i;
    return arnRegex.test(input);
}

export function extractResourceName(input: string | null | undefined): string | null {
    logger.debug(input, "extractResourceName. Input value");
    if (!input || !isArn(input)) {
        return null;
    }

    // ARN format: arn:aws:partition:service:region:account-id:resource
    const parts = input.split(":");
    logger.debug(parts, "extractResourceName. parts");
    const nameOfResource = parts[parts.length - 1];
    logger.debug(nameOfResource, "extractResourceName. nameOfResource");
    return nameOfResource;
}