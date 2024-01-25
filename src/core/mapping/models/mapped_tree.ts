import { MappedApiGatewayRestApi }                from "./mapped_aws_apigateway";
import { MappedEventsEventBus, MappedEventsRule } from "./mapped_aws_events";
import { MappedDynamoDbTable }                    from "./mapped_aws_dynamodb";
import { MappedStepFunctionsStateMachine }        from "./mapped_aws_stepfunctions";
import { MappedLambdaFunction }                   from "./mapped_aws_lambda";
import { MappedS3Bucket }                         from "./mapped_aws_s3";
import { MappedSNSTopic }                         from "./mapped_aws_sns";
import { MappedSQSQueue }                         from "./mapped_aws_sqs";
import { CommonMappedResource }                   from "./mapped_common";
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
}                                                 from "../../cloudformation/constants";

const DOC_RESOURCES = [
    AWS_API_GATEWAY_REST_API,
    AWS_DYNAMO_DB_TABLE,
    AWS_EVENTS_EVENT_BUS,
    AWS_EVENTS_RULE,
    AWS_LAMBDA_FUNCTION,
    AWS_S3_BUCKET,
    AWS_SNS_TOPIC,
    AWS_SQS_QUEUE,
    AWS_STEP_FUNCTIONS_STATE_MACHINE,
];

export class DocumentResourcesTree {
    private mappedResources: Map<string, Set<CommonMappedResource>>;


    constructor() {
        this.mappedResources = new Map<string, Set<CommonMappedResource>>();
    }

    addResource(resource: CommonMappedResource) {
        if (resource === undefined || resource === null) {
            throw new Error("Passed resource is undefined or empty");
        }
        const resType = resource.type;

        let setOfResources = this.mappedResources.get(resType);
        if (setOfResources === undefined) {
            setOfResources = new Set<CommonMappedResource>();
        }

        setOfResources.add(resource);
        this.mappedResources.set(resType, setOfResources);
    }

    getMappedApiGatewayRestApi(): MappedApiGatewayRestApi[] {
        const resources = this.mappedResources.get(AWS_API_GATEWAY_REST_API);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedApiGatewayRestApi;
        });
    }

    getMappedEventsEventBus(): MappedEventsEventBus[] {
        const resources = this.mappedResources.get(AWS_EVENTS_EVENT_BUS);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedEventsEventBus;
        });
    }

    getMappedEventsRule(): MappedEventsRule[] {
        const resources = this.mappedResources.get(AWS_EVENTS_RULE);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedEventsRule;
        });
    }

    getMappedDynamoDbTable(): MappedDynamoDbTable[] {
        const resources = this.mappedResources.get(AWS_DYNAMO_DB_TABLE);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedDynamoDbTable;
        });
    }

    getMappedStepFunctionsStateMachine(): MappedStepFunctionsStateMachine[] {
        const resources = this.mappedResources.get(AWS_STEP_FUNCTIONS_STATE_MACHINE);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedStepFunctionsStateMachine;
        });
    }

    getMappedLambdaFunction(): MappedLambdaFunction[] {
        const resources = this.mappedResources.get(AWS_LAMBDA_FUNCTION);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedLambdaFunction;
        });
    }

    getMappedS3Bucket(): MappedS3Bucket[] {
        const resources = this.mappedResources.get(AWS_S3_BUCKET);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedS3Bucket;
        });
    }

    getMappedSNSTopic(): MappedSNSTopic[] {
        const resources = this.mappedResources.get(AWS_SNS_TOPIC);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedSNSTopic;
        });
    }

    getMappedSQSQueue(): MappedSQSQueue[] {
        const resources = this.mappedResources.get(AWS_SQS_QUEUE);
        if (resources === undefined) {
            return [];
        }
        return Array.from(resources).map(res => {
            return res as MappedSQSQueue;
        });
    }

    getOtherResources(): CommonMappedResource[] {
        const otherResKeys = Array.from(this.mappedResources.keys()).filter(key => !(key in DOC_RESOURCES));
        const resources: CommonMappedResource[] = [];
        for (const key in otherResKeys) {
            const arr = this.mappedResources.get(key);
            if (arr !== undefined) {
                arr.forEach(value => resources.push(value));
            }
        }
        return resources;
    }

    getAllResources(): CommonMappedResource[] {
        const resources: CommonMappedResource[] = [];
        Array.from(this.mappedResources.keys()).forEach(key => {
            const arr = this.mappedResources.get(key);
            if (arr !== undefined) {
                arr.forEach(value => resources.push(value));
            }
        });
        return resources;
    }
}