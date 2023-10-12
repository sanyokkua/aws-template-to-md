import { ResourcesMappedById, ResourcesMappedByType }   from "../aws/parser";
import {
    ApiGatewayRestApi,
    CommonResource,
    DocumentResourcesTree,
    DynamoDbTable,
    EventsEventBus,
    EventsRule,
    LambdaFunction,
    S3Bucket,
    SNSTopic,
    SQSQueue,
    StepFunctionsStateMachine,
}                                                       from "./mapper/models/models";
import { getMappedApiGatewayRestApi }                   from "./mapper/utils/api_gateway_utils";
import { getMappedEventsEventBus, getMappedEventsRule } from "./mapper/utils/events_utils";
import { getMappedDynamoDbTable }                       from "./mapper/utils/dynamodb_utils";
import { getMappedStepFunctionsStateMachine }           from "./mapper/utils/stepfunction_utils";
import { getMappedLambdaFunction }                      from "./mapper/utils/lambda_utils";
import { getMappedS3Bucket }                            from "./mapper/utils/s3_utils";
import { getMappedSNSTopic }                            from "./mapper/utils/sns_utils";
import { getMappedSQSQueue }                            from "./mapper/utils/sqs_utils";
import { getCommonResources }                           from "./mapper/utils/common_resource_utils";

export function mapAwsResourcesToMdTypes(resources: [ResourcesMappedByType, ResourcesMappedById]): DocumentResourcesTree {
    const mappedApiGatewayRestApi: ApiGatewayRestApi[] = getMappedApiGatewayRestApi(resources);
    const mappedEventsEventBus: EventsEventBus[] = getMappedEventsEventBus(resources);
    const mappedEventsRule: EventsRule[] = getMappedEventsRule(resources);
    const mappedDynamoDbTable: DynamoDbTable[] = getMappedDynamoDbTable(resources);
    const mappedStepFunctionsStateMachine: StepFunctionsStateMachine[] = getMappedStepFunctionsStateMachine(resources);
    const mappedLambdaFunction: LambdaFunction[] = getMappedLambdaFunction(resources);
    const mappedS3Bucket: S3Bucket[] = getMappedS3Bucket(resources);
    const mappedSNSTopic: SNSTopic[] = getMappedSNSTopic(resources);
    const mappedSQSQueue: SQSQueue[] = getMappedSQSQueue(resources);
    const mappedAllResourcesToCommonResource: CommonResource[] = getCommonResources(resources);

    return {
        mappedApiGatewayRestApi: mappedApiGatewayRestApi,
        mappedEventsEventBus: mappedEventsEventBus,
        mappedEventsRule: mappedEventsRule,
        mappedDynamoDbTable: mappedDynamoDbTable,
        mappedStepFunctionsStateMachine: mappedStepFunctionsStateMachine,
        mappedLambdaFunction: mappedLambdaFunction,
        mappedS3Bucket: mappedS3Bucket,
        mappedSNSTopic: mappedSNSTopic,
        mappedSQSQueue: mappedSQSQueue,
        mappedAllResources: mappedAllResourcesToCommonResource,
    };
}