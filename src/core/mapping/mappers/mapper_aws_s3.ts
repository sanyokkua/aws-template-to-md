import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import { AWS_S3_BUCKET }                                        from "../../cloudformation/constants";
import { getFixedName }                                         from "../utils/utils";
import { MappedS3Bucket }                                       from "../models/mapped_aws_s3";
import { AwsS3Bucket }                                          from "../../cloudformation/models/aws_s3";

export class MapperMappedS3Bucket implements Mapper<MappedS3Bucket> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedS3Bucket {
        basicResourceValidation(resource, AWS_S3_BUCKET);

        const s3Resource: AwsS3Bucket = resource as AwsS3Bucket;
        const s3Id: string = s3Resource._ID;
        const s3Type: string = s3Resource.Type;
        const s3Name: string = getFixedName(s3Resource._Name, options);

        return {
            id: s3Id,
            type: s3Type,
            name: s3Name,
        };
    }
}