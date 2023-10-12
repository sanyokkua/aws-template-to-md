import { ResourcesMappedById, ResourcesMappedByType } from "../../../aws/parser";
import { S3Bucket }                                   from "../models/models";
import { AWS_S3_Bucket }                              from "../../../aws/constants";
import { AwsS3Bucket }                                from "../../../aws/models/s3/s3";

export function getMappedS3Bucket(resources: [ResourcesMappedByType, ResourcesMappedById]): S3Bucket[] {
    const resourcesByType = resources[0];
    const result: S3Bucket[] = [];
    const stepFunctions = resourcesByType[AWS_S3_Bucket];

    if (stepFunctions === undefined || stepFunctions.length === 0) {
        return result;
    }

    return stepFunctions
        .map(resource => resource as AwsS3Bucket)
        .map(s3 => {
            const name = s3.Name !== undefined && s3.Name.length > 0
                         ? s3.Name : s3.ID;

            return {
                id: s3.ID,
                type: s3.Type,
                name: name,
                updateReplacePolicy: s3.UpdateReplacePolicy,
                deletionPolicy: s3.DeletionPolicy,
            };
        });
}
