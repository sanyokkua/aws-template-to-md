import {
    CODE_BLOCK_SYMBOL,
    HEADER_COLUMN,
    MDCodeSyntax,
    MDHeader,
    MDListType,
    MDTextStyle,
    NEW_LINE,
}                        from "./constants";
import { isEmptyString } from "../string_utils";

export function mdMakeHeader(text: string, headerLevel: MDHeader): string {
    if (isEmptyString(text)) {
        return "";
    }
    return `${NEW_LINE}${headerLevel} ${text}${NEW_LINE}`;
}

export function mdAddStyleToText(text: string, style: MDTextStyle): string {
    if (isEmptyString(text)) {
        return "";
    }
    return `${style}${text}${style}`;
}

export function mdMakeList(values: string[], header: string = "", listType: MDListType = MDListType.UNORDERED, headerLevel: MDHeader = MDHeader.HEADER_LEVEL_3): string {
    if (values === undefined || values === null || values.length === 0) {
        return "";
    }

    const textLines: string[] = [];

    if (!isEmptyString(header)) {
        textLines.push(mdMakeHeader(header, headerLevel));
    }

    values.forEach((value, index) => {
        let symbol: string;
        if (listType === MDListType.ORDERED) {
            symbol = `${index + 1}. `;
        } else {
            symbol = "- ";
        }
        textLines.push(`${symbol}${values[index]}`);
    });

    return textLines.join(NEW_LINE);
}

export function mdMakeTable(headerLine: string[], values: string[][]): string {
    if (headerLine.length === 0 || values.length === 0) {
        return "";
    }
    const resultText: string[] = [];

    resultText.push(makeTableHeader(headerLine));
    for (let i = 0; i < values.length; i++) {
        const currentLineValues = values[i];
        if (currentLineValues.length !== headerLine.length) {
            throw Error("Number of columns is not equal (Header != values)");
        }
        resultText.push(joinTableColumns(currentLineValues));
    }

    return resultText.join(NEW_LINE);
}

function makeTableHeader(values: string[]): string {
    const headerDividerRow: string[] = [];
    for (let i = 0; i < values.length; i++) {
        headerDividerRow.push(HEADER_COLUMN);
    }
    const headerLine: string = joinTableColumns(values);
    const dividerLine: string = joinTableColumns(headerDividerRow);

    return `${headerLine}${NEW_LINE}${dividerLine}`;
}

function joinTableColumns(values: string[]): string {
    return `| ${values.join(" | ")} |`;
}

export function mdMakeContentBlock(content: string, header: string = "", headerLevel: MDHeader = MDHeader.HEADER_LEVEL_2): string {
    if (isEmptyString(content) && isEmptyString(header)) {
        return "";
    }

    if (isEmptyString(header)) {
        return `${NEW_LINE}${content}${NEW_LINE}`;
    }

    const contentLines: string[] = [];
    const headerText: string = mdMakeHeader(header, headerLevel);

    contentLines.push(headerText);
    contentLines.push(content);

    return `${contentLines.join(NEW_LINE)}${NEW_LINE}`;
}

export function mdMakeCodeBlock(codeContent: string, syntax: MDCodeSyntax): string {
    return `${CODE_BLOCK_SYMBOL}${syntax}${NEW_LINE}${codeContent}${NEW_LINE}${CODE_BLOCK_SYMBOL}`;
}

export function mdCreateLink(link: string, name: string): string {
    return `[${name}](${link})`;
}

export function mdCreateImageLink(link: string, description: string): string {
    return `![${description}](${link})`;
}

export function mdMakeCollapsableSection(content: string, header: string): string {
    const openTag: string = "<details>";
    const closeTag: string = "</details>";
    const headerOpenTag: string = "<summary>";
    const headerCloseTag: string = "</summary>";

    const data: string[] = [
        openTag,
        headerOpenTag,
        header,
        headerCloseTag,
        content,
        closeTag,
    ];

    return data.join(NEW_LINE);
}

export function mdCreateTableOfContent(headers: string[]): string {
    const tableOfContentsEntries = headers.map((heading) => {
        const headingLevel = heading.split("#").length - 1;
        const headingText = heading.substring(headingLevel + 1);
        const headingAnchor = headingText.toLowerCase().replace(/\s+/g, "-");
        let counter = -2;
        for (let headingElement of heading) {
            if (headingElement !== "#") {
                break;
            }
            counter += 2;
        }
        return {value: `[${headingText}](#${headingAnchor})`, level: counter};
    });
    return createMdListUnorderedWithLevel("Table Of Content", tableOfContentsEntries);
}

function createMdListUnorderedWithLevel(header: string, items: { value: string, level: number }[]): string {
    const text: string[] = [];

    if (header !== undefined && header.length > 0) {
        text.push(mdMakeHeader(header, MDHeader.HEADER_LEVEL_2));
    }

    for (let i = 0; i < items.length; i++) {
        let symbol = "";
        for (let j = 0; j < items[i].level; j++) {
            symbol += " ";
        }
        symbol += "- ";
        text.push(`${symbol}${items[i].value}`);
    }

    return text.join(NEW_LINE);
}