export type AdditionalConfigs = { [key: string]: any }

export type MarkdownWriterFunc<T> = (dataValue: T, additionalConfigs?: AdditionalConfigs) => string;