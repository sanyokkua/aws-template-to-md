import {
    createContentBlock,
    createMdList,
    MdHeader,
    MdListType,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                          from "../common/common_md_functions";
import { DocumentResourcesTree, S3Bucket } from "../../mapper/models/models";

function createS3Content(s3Buckets: S3Bucket[]): string {
    const s3BucketsNames: string[] = s3Buckets.map(s3 => s3.name);

    return createMdList("S3 Buckets:", s3BucketsNames, MdListType.UNORDERED);
}

export const writeS3Buckets: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const s3Buckets = params.value.mappedS3Bucket;
    if (s3Buckets === undefined || s3Buckets.length === 0) {
        return "";
    }

    const content: string = createS3Content(s3Buckets);
    return createContentBlock("AWS S3 Bucket Information", MdHeader.HEADER_LEVEL_2, content);
};