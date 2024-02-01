export enum MDHeader {
    HEADER_LEVEL_1 = "#",
    HEADER_LEVEL_2 = "##",
    HEADER_LEVEL_3 = "###",
    HEADER_LEVEL_4 = "####",
    HEADER_LEVEL_5 = "#####",
    HEADER_LEVEL_6 = "######",
}

export enum MDTextStyle {
    BOLD = "**",
    ITALIC = "*",
    BOLD_ITALIC = "***",
}

export enum MDListType {
    ORDERED,
    UNORDERED
}

export enum MDCodeSyntax {
    NONE = "",
    JSON = "json",
}

export const HEADER_COLUMN: string = "---";
export const CODE_BLOCK_SYMBOL: string = "```";
export const NEW_LINE: string = "\n";