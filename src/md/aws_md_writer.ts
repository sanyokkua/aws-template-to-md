import { DocumentResourcesTree }    from "./models";
import { NEW_LINE, WriterFunction } from "./writers/common/common";
import { writeAmountOfResources }   from "./writers/amount_writer";
import { writeListOfResources }     from "./writers/resources_list_writer";
import { writeAwsApiGateways }      from "./writers/api_gateway_writer";
import { writeEventBuses }          from "./writers/event_bus_writer";
import { writeEventRules }          from "./writers/event_rule_writer";
import { writeDynamoDbTables }      from "./writers/dynamodb_writer";
import { writeLambdaFunctions }     from "./writers/lambda_writer";
import { writeSqsQueues }           from "./writers/sqs_writer";
import { writeSnsTopics }           from "./writers/sns_writer";
import { writeStepFunctions }       from "./writers/stepfunction_writer";
import { writeS3Buckets }           from "./writers/s3_writer";

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
        const writingResult = writer(resources);
        if (writingResult !== undefined && writingResult.length > 0) {
            result.push(writingResult);
        }
    });

    return result.join(NEW_LINE);
}