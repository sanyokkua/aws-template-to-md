import {
    ApiGatewayRestApi,
    DynamoDbTable,
    EventsEventBus,
    EventsRule,
    LambdaFunction,
    S3Bucket,
    SNSTopic,
    SQSQueue,
    StepFunctionsStateMachine,
} from "../../mapper/models/models";

export type WriterParams<T> = {
    value: T;
}
export type WriterOptions = { [key: string]: any }

export type WriterFunc<T> = (params: WriterParams<T>, options?: WriterOptions) => string;

export type AllowedResource = ApiGatewayRestApi |
                              EventsEventBus |
                              EventsRule |
                              DynamoDbTable |
                              StepFunctionsStateMachine |
                              LambdaFunction |
                              S3Bucket |
                              SNSTopic |
                              SQSQueue;

export enum MdHeader {
    HEADER_LEVEL_1 = "#",
    HEADER_LEVEL_2 = "##",
    HEADER_LEVEL_3 = "###",
    HEADER_LEVEL_4 = "####",
    HEADER_LEVEL_5 = "#####",
    HEADER_LEVEL_6 = "######",
}

export const NEW_LINE: string = "\n";

export enum MdStyle {
    BOLD = "**",
    ITALIC = "*",
    BOLD_ITALIC = "***",
}

export enum MdListType {
    ORDERED,
    UNORDERED
}

export enum CodeSyntax {
    NONE = "",
    JSON = "json",
}


export function createMdHeader(text: string, headerLevel: MdHeader): string {
    return `\n${headerLevel} ${text}\n`;
}

export function createMdList(header: string, values: string[], listType: MdListType): string {
    const text: string[] = [];

    if (header !== undefined && header.length > 0) {
        text.push(createMdHeader(header, MdHeader.HEADER_LEVEL_2));
    }

    for (let i = 0; i < values.length; i++) {
        let symbol = "";
        if (listType === MdListType.ORDERED) {
            symbol = `${i + 1}. `;
        } else {
            symbol = "- ";
        }
        text.push(`${symbol}${values[i]}`);
    }

    return text.join("\n");
}

export function createMdListUnorderedWithLevel(header: string, items: { value: string, level: number }[]): string {
    const text: string[] = [];

    if (header !== undefined && header.length > 0) {
        text.push(createMdHeader(header, MdHeader.HEADER_LEVEL_2));
    }

    for (let i = 0; i < items.length; i++) {
        let symbol = "";
        for (let j = 0; j < items[i].level; j++) {
            symbol += " ";
        }
        symbol += "- ";
        text.push(`${symbol}${items[i].value}`);
    }

    return text.join("\n");
}

export function createStyledText(text: string, style: MdStyle): string {
    return `${style}${text}${style}`;
}

export function createMdTable(headerLine: string[], values: string[][]): string {
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

    return resultText.join("\n");
}

export function createMdCodeBlock(codeString: string, syntax: CodeSyntax): string {
    const CODE_BLOCK_SYMBOL: string = "```";
    return `${CODE_BLOCK_SYMBOL}${syntax}\n${codeString}\n${CODE_BLOCK_SYMBOL}`;
}

export function createContentBlock(header: string, headerLevel: MdHeader, content: string): string {
    const resultStrings: string[] = [];
    const headerText: string = createMdHeader(header, headerLevel);

    resultStrings.push(headerText);
    resultStrings.push(content);

    return resultStrings.join(NEW_LINE);
}

export function createImageLink(description: string, link: string): string {
    return `![${description}](${link})`;
}

export function createLink(name: string, link: string): string {
    return `[${name}](${link})`;
}

export function createTableOfContent(headers: string[]): string {
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

export function createCollapsableSection(header: string, content: string): string {
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

function joinTableColumns(values: string[]): string {
    return `| ${values.join(" | ")} |`;
}

function makeTableHeader(values: string[]): string {
    const HEADER_COLUMN = "---";
    const header_divider_row: string[] = [];
    for (let i = 0; i < values.length; i++) {
        header_divider_row.push(HEADER_COLUMN);
    }
    const headerLine: string = joinTableColumns(values);
    const dividerLine: string = joinTableColumns(header_divider_row);

    return `${headerLine}\n${dividerLine}`;
}
