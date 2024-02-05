import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { MappedS3Bucket }                        from "../../../mapping/models/mapped_aws_s3";
import { mdMakeContentBlock, mdMakeList }        from "../../utils";
import logger                                    from "../../../../logger";


export const createAwsS3SectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsS3SectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const mappedS3Buckets = dataValue.getMappedS3Bucket();
    if (isEmptyArray(mappedS3Buckets)) {
        logger.debug({}, "createAwsS3SectionText. mappedS3Buckets is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsS3SectionText. input values");

    return createMarkdownContent(mappedS3Buckets);
};

function createMarkdownContent(mappedS3Buckets: MappedS3Bucket[]): string {
    const s3BucketsNames: string[] = mappedS3Buckets.map(s3 => s3.name);
    const bucketsList = mdMakeList(s3BucketsNames, "S3 Buckets:");

    return mdMakeContentBlock(bucketsList, "AWS S3 Bucket Information");
}
