import { DocumentResourcesTree }                              from "./models/mapped_tree";
import { RawCloudFormationResourcesCollection }               from "../cloudformation/models/common_models";
import { Mapper }                                             from "./mappers/mapper";
import { MapperApiGatewayRestApi }                            from "./mappers/mapper_aws_apigateway";
import { CommonMappedResource }                               from "./models/mapped_common";
import {
    AWS_API_GATEWAY_REST_API,
    AWS_DYNAMO_DB_TABLE,
    AWS_EVENTS_EVENT_BUS,
    AWS_EVENTS_RULE,
    AWS_LAMBDA_FUNCTION,
    AWS_S3_BUCKET,
    AWS_SNS_TOPIC,
    AWS_SQS_QUEUE,
    AWS_STEP_FUNCTIONS_STATE_MACHINE,
}                                                             from "../cloudformation/constants";
import { MapperDefault }                                      from "./mappers/mapper_aws_default";
import { ParsingOptions }                                     from "./options/parsing_options";
import { MapperDynamoDbTable }                                from "./mappers/mapper_aws_dynamodb";
import { MapperMappedEventsEventBus, MapperMappedEventsRule } from "./mappers/mapper_aws_events";
import { MapperMappedLambdaFunction }                         from "./mappers/mapper_aws_lambda";
import { MapperMappedS3Bucket }                               from "./mappers/mapper_aws_s3";
import { MapperMappedSNSTopic }                               from "./mappers/mapper_aws_sns";
import { MapperMappedSQSQueue }                               from "./mappers/mapper_aws_sqs";
import { MapperMappedStepFunctionsStateMachine }              from "./mappers/mapper_aws_stepfunctions";
import { isEmptyString }                                      from "../string_utils";
import logger                                                 from "../../logger";


const AWS_RES_TO_APP_STRUCT_MAPPERS = new Map<string, Mapper<CommonMappedResource>>(
    [
        [`${AWS_API_GATEWAY_REST_API}`, new MapperApiGatewayRestApi()],
        [`${AWS_DYNAMO_DB_TABLE}`, new MapperDynamoDbTable()],
        [`${AWS_EVENTS_EVENT_BUS}`, new MapperMappedEventsEventBus()],
        [`${AWS_EVENTS_RULE}`, new MapperMappedEventsRule()],
        [`${AWS_LAMBDA_FUNCTION}`, new MapperMappedLambdaFunction()],
        [`${AWS_S3_BUCKET}`, new MapperMappedS3Bucket()],
        [`${AWS_SNS_TOPIC}`, new MapperMappedSNSTopic()],
        [`${AWS_SQS_QUEUE}`, new MapperMappedSQSQueue()],
        [`${AWS_STEP_FUNCTIONS_STATE_MACHINE}`, new MapperMappedStepFunctionsStateMachine()],
    ]);

const DEFAULT_MAPPER = new MapperDefault();

export function createDocumentResourcesTree(rawResCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): DocumentResourcesTree {
    if (rawResCollection === undefined || rawResCollection === null) {
        logger.debug({rawResCollection, options}, "createDocumentResourcesTree. rawResCollection is null");
        throw new Error("Passed RawCloudFormationResourcesCollection is null or undefined, check console for details");
    }

    const docTree = new DocumentResourcesTree();

    rawResCollection.getAllResources().forEach(resource => {
        if (resource.Type === undefined || resource.Type === null || isEmptyString(resource.Type)) {
            logger.debug(resource, "createDocumentResourcesTree. getAllResources().forEach, resource type is absent");
            throw new Error(
                "Type is null or empty, incorrect resource passed to cloud formation mapper, check console for details");
        }

        let mapperForCurrentResourceType = AWS_RES_TO_APP_STRUCT_MAPPERS.get(resource.Type);
        logger.debug(mapperForCurrentResourceType, "createDocumentResourcesTree. mapperForCurrentResourceType");
        if (mapperForCurrentResourceType === undefined) {
            logger.debug(mapperForCurrentResourceType,
                         "createDocumentResourcesTree. mapperForCurrentResourceType is null, default mapper will be used");
            mapperForCurrentResourceType = DEFAULT_MAPPER;
        }

        const mappedResource = mapperForCurrentResourceType.mapResource(resource, rawResCollection, options);
        docTree.addResource(mappedResource);
        logger.debug({mappedResource, docTree}, "createDocumentResourcesTree. resource was mapped and added to tree");
    });

    logger.debug(docTree, "createDocumentResourcesTree. Final tree will be returned");
    return docTree;
}