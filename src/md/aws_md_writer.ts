import { DocumentResourcesTree }       from "./models/models";
import { AwsWriterFunction, NEW_LINE } from "./writers/common/common_md_functions";
import { writeAmountOfResources }      from "./writers/amount_writer";
import { writeListOfResources }        from "./writers/resources_list_writer";
import { writeAwsApiGateways }         from "./writers/api_gateway_writer";
import { writeEventBuses }             from "./writers/event_bus_writer";
import { writeEventRules }             from "./writers/event_rule_writer";
import { writeDynamoDbTables }         from "./writers/dynamodb_writer";
import { writeLambdaFunctions }        from "./writers/lambda_writer";
import { writeSqsQueues }              from "./writers/sqs_writer";
import { writeSnsTopics }              from "./writers/sns_writer";
import { writeStepFunctions }          from "./writers/stepfunction_writer";
import { writeS3Buckets }              from "./writers/s3_writer";

export interface WriterWrapper<T> {
    Name: string;
    Writer: AwsWriterFunction;
    Options: T;

    getMarkDownResult(resources: DocumentResourcesTree): string;
}

const AmountOfResources: WriterWrapper<any> = {
    Name: "AmountOfResources",
    Writer: writeAmountOfResources,
    Options: {},
    getMarkDownResult(resources: DocumentResourcesTree): string {
        return this.Writer(resources, this.Options);
    },
};

const ListOfResources: WriterWrapper<any> = {
    Name: "ListOfResources",
    Writer: writeListOfResources,
    Options: {},
    getMarkDownResult(resources: DocumentResourcesTree): string {
        return this.Writer(resources, this.Options);
    },
};

export const AVAILABLE_WRITERS_WRAPPERS: WriterWrapper<any>[] = [AmountOfResources, ListOfResources];

export const AVAILABLE_WRITERS: AwsWriterFunction[] = [
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

export function createMarkdownDocument(resources: DocumentResourcesTree, writers: AwsWriterFunction[]): string {
    const result: string[] = [];
    writers.forEach(writer => {
        const writingResult = writer(resources);
        if (writingResult !== undefined && writingResult.length > 0) {
            result.push(writingResult);
        }
    });

    return result.join(NEW_LINE);
}