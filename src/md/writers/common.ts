import {
    ApiGatewayRestApi,
    DocumentResourcesTree,
    DynamoDbTable,
    EventsEventBus,
    EventsRule,
    LambdaFunction,
    S3Bucket,
    SNSTopic,
    SQSQueue,
    StepFunctionsStateMachine,
} from "../models";

export type WriterFunction = (resourcesList: DocumentResourcesTree) => string;

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


export function makeHeader(text: string, headerLevel: MdHeader): string {
    return `\n${headerLevel} ${text}\n`;
}

export function applyStyle(text: string, style: MdStyle): string {
    return `${style}${text}${style}`;
}

export function createMdList(header: string, values: string[], listType: MdListType): string {
    const text: string[] = [];

    if (header !== undefined && header.length > 0) {
        text.push(makeHeader(header, MdHeader.HEADER_LEVEL_2));
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