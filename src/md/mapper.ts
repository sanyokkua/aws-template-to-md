import { ResourcesMappedById, ResourcesMappedByType }   from "../aws/parser";
import {
    ApiGatewayRestApi,
    DocumentResourcesTree,
    DynamoDbTable,
    EventsEventBus,
    EventsRule,
    LambdaFunction,
    S3Bucket,
    SNSTopic,
    SQSQueue,
    StepFunctionsStateMachine,
}                                                       from "./models";
import { getMappedApiGatewayRestApi }                   from "./utils/api_gateway_utils";
import { getMappedEventsEventBus, getMappedEventsRule } from "./utils/events_utils";
import { getMappedDynamoDbTable }                       from "./utils/dynamodb_utils";
import { getMappedStepFunctionsStateMachine }           from "./utils/stepfunction_utils";
import { getMappedLambdaFunction }                      from "./utils/lambda_utils";
import { getMappedS3Bucket }                            from "./utils/s3_utils";
import { getMappedSNSTopic }                            from "./utils/sns_utils";
import { getMappedSQSQueue }                            from "./utils/sqs_utils";

export function mapAwsResourcesToMd(resources: [ResourcesMappedByType, ResourcesMappedById]): DocumentResourcesTree {
    const mappedApiGatewayRestApi: ApiGatewayRestApi[] = getMappedApiGatewayRestApi(resources);
    const mappedEventsEventBus: EventsEventBus[] = getMappedEventsEventBus(resources);
    const mappedEventsRule: EventsRule[] = getMappedEventsRule(resources);
    const mappedDynamoDbTable: DynamoDbTable[] = getMappedDynamoDbTable(resources);
    const mappedStepFunctionsStateMachine: StepFunctionsStateMachine[] = getMappedStepFunctionsStateMachine(resources);
    const mappedLambdaFunction: LambdaFunction[] = getMappedLambdaFunction(resources);
    const mappedS3Bucket: S3Bucket[] = getMappedS3Bucket(resources);
    const mappedSNSTopic: SNSTopic[] = getMappedSNSTopic(resources);
    const mappedSQSQueue: SQSQueue[] = getMappedSQSQueue(resources);

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
    };
}