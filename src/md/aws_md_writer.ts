import { DocumentResourcesTree }  from "./models";
import { WriterFunction }         from "./writers/common";
import { writeAmountOfResources } from "./writers/amount_writer";
import { writeListOfResources }   from "./writers/resources_list_writer";
import { writeAwsApiGateways }    from "./writers/api_gateway_writer";
import { writeEventBuses }        from "./writers/event_bus_writer";
import { writeEventRules }        from "./writers/event_rule_writer";
import { writeDynamoDbTables }    from "./writers/dynamodb_writer";
import { writeLambdaFunctions }   from "./writers/lambda_writer";
import { writeSqsQueues }         from "./writers/sqs_writer";
import { writeSnsTopics }         from "./writers/sns_writer";
import { writeStepFunctions }     from "./writers/stepfunction_writer";
import { writeS3Buckets }         from "./writers/s3_writer";

const AVAILABLE_WRITERS: WriterFunction[] = [
    writeAmountOfResources,
    writeListOfResources,
    writeAwsApiGateways,
    writeEventBuses,
    writeEventRules,
    writeDynamoDbTables,
    writeLambdaFunctions,
    writeSqsQueues,
    writeSnsTopics,
    writeStepFunctions,
    writeS3Buckets,
];

export function writeDescriptionForStack(resources: DocumentResourcesTree): string {
    const result: string[] = [];
    AVAILABLE_WRITERS.forEach(writer => {
        result.push(writer(resources));
    });
    return result.join("\n");
}