import { NEW_LINE, WriterFunc, WriterOptions, WriterParams } from "./writers/common/common_md_functions";

export interface WriterWrapper<T> {
    Name: string;
    WriterParams: WriterParams<T>;
    Writer: WriterFunc<T>;
    Options?: WriterOptions;

    getMarkdownResult(): string;
}

export class WriterWrapperImpl implements WriterWrapper<any> {
    Name: string;
    WriterParams: WriterParams<any>;
    Writer: WriterFunc<any>;
    Options: WriterOptions;

    constructor(Name: string, Writer: WriterFunc<any>, WriterParams: WriterParams<any>, Options: WriterOptions) {
        this.Name = Name;
        this.WriterParams = WriterParams;
        this.Writer = Writer;
        this.Options = Options;
    }

    getMarkdownResult(): string {
        return this.Writer(this.WriterParams, this.Options);
    }

}

export function createMarkdownDocumentBasedOnTheWriters(writers: WriterWrapperImpl[]): string {
    const result: string[] = [];
    writers.forEach(writerWrapperObj => {
        const writingResult = writerWrapperObj.getMarkdownResult();
        if (writingResult !== undefined && writingResult.length > 0) {
            result.push(writingResult);
        }
    });

    return result.join(NEW_LINE);
}