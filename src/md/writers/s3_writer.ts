import { createMdList, makeHeader, MdHeader, MdListType, WriterFunction } from "./common";
import { DocumentResourcesTree }                                          from "../models";

export const writeS3Buckets: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const s3Buckets = resourcesList.mappedS3Bucket;
    if (s3Buckets === undefined || s3Buckets.length === 0) {
        return "";
    }

    const resultText: string[] = [];
    const header = makeHeader("AWS S3 Bucket Information", MdHeader.HEADER_LEVEL_2);
    resultText.push(header);

    const s3BucketsNames: string[] = s3Buckets.map(s3 => s3.name);
    const mdList = createMdList("S3 Buckets:", s3BucketsNames, MdListType.UNORDERED);
    resultText.push(mdList);

    return resultText.join("\n");
};