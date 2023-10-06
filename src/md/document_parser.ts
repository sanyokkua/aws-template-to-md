import { DocumentResourcesTree, ParserParameters }                             from "./models/models";
import { parseCloudForgeTemplate, ResourcesMappedById, ResourcesMappedByType } from "../aws/parser";
import { mapAwsResourcesToMdTypes }                                            from "./mapper";
import { createMarkdownDocumentBasedOnTheWriters, WriterWrapperImpl }          from "./aws_md_writer";
import { writeListOfResources }                                                from "./writers/resources_list_writer";
import { writeAmountOfResources }                                              from "./writers/amount_writer";
import { writeAwsApiGateways }                                                 from "./writers/api_gateway_writer";
import { writeEventBuses }                                                     from "./writers/event_bus_writer";
import { writeEventRules }                                                     from "./writers/event_rule_writer";
import { writeDynamoDbTables }                                                 from "./writers/dynamodb_writer";
import { writeLambdaFunctions }                                                from "./writers/lambda_writer";
import { writeSqsQueues }                                                      from "./writers/sqs_writer";
import { writeSnsTopics }                                                      from "./writers/sns_writer";
import { writeStepFunctions }                                                  from "./writers/stepfunction_writer";
import { writeS3Buckets }                                                      from "./writers/s3_writer";
import { writeAccountInfo }                                                    from "./writers/account_info_writer";
import { writeRepositoryName }                                                 from "./writers/repository_name_writer";
import { writeTags }                                                           from "./writers/tag_writer";
import { writeMaintainers }                                                    from "./writers/maintainers_writer";
import { writeRepositoryCommonInfo }                                           from "./writers/repository_info_writer";
import { writeCustomText }                                                     from "./writers/md_writer";

const WRITER_REPOSITORY_NAME = "repositoryName";
const WRITER_REPOSITORY_TAGS = "tags";
const WRITER_REPOSITORY_MAINTAINERS = "maintainers";
const WRITER_REPOSITORY_INFORMATION = "repoInfo";
const WRITER_ACCOUNTS = "accounts";
const WRITER_AMOUNT_OF_RESOURCES = "amountOfResources";
const WRITER_LIST_OF_MAIN_RESOURCES = "listOfResources";
const WRITER_AWS_API_GATEWAY = "apiGateway";
const WRITER_AWS_EVENT_BUS = "eventBus";
const WRITER_AWS_EVENT_RULE = "eventRules";
const WRITER_AWS_DYNAMO_DB = "dynamodb";
const WRITER_AWS_LAMBDA = "lambda";
const WRITER_AWS_SQS = "sqs";
const WRITER_AWS_SNS = "sns";
const WRITER_AWS_STEP_FUNCTION = "stepFunctions";
const WRITER_AWS_S3 = "s3";
const WRITER_CUSTOM_MD_TEXT = "customs";

export const AVAILABLE_WRITERS = [
    WRITER_REPOSITORY_NAME,
    WRITER_REPOSITORY_TAGS,
//"":// TODO:,
//"":// TODO:,
    WRITER_REPOSITORY_MAINTAINERS,
    WRITER_REPOSITORY_INFORMATION,
    WRITER_ACCOUNTS,
//"":// TODO:,
    WRITER_AMOUNT_OF_RESOURCES,
    WRITER_LIST_OF_MAIN_RESOURCES,
    WRITER_AWS_API_GATEWAY,
    WRITER_AWS_EVENT_BUS,
    WRITER_AWS_EVENT_RULE,
    WRITER_AWS_DYNAMO_DB,
    WRITER_AWS_LAMBDA,
    WRITER_AWS_SQS,
    WRITER_AWS_SNS,
    WRITER_AWS_STEP_FUNCTION,
    WRITER_AWS_S3,
    WRITER_CUSTOM_MD_TEXT,
];

export function parseCloudFormationTemplate(parameters: ParserParameters): string {
    try {
        const parsedCloudFormationTemplate: [ResourcesMappedByType, ResourcesMappedById] = parseCloudForgeTemplate(
            parameters.templateJsonValue,
            parameters.templateResourceNamePrefixToRemove,
            parameters.templateResourceNameSuffixToRemove,
        );
        console.log("Cloud Formation JSON parsed");

        const documentResourcesTree: DocumentResourcesTree = mapAwsResourcesToMdTypes(parsedCloudFormationTemplate);
        console.log("Parsed Cloud Formation JSON is mapped to DocumentResourcesTree");

        const ALL_AVAILABLE_WRITERS: { [key: string]: WriterWrapperImpl } = {
            "repositoryName": new WriterWrapperImpl(WRITER_REPOSITORY_NAME,
                                                    writeRepositoryName,
                                                    {value: parameters.repositoryName},
                                                    {}),
            "tags": new WriterWrapperImpl(WRITER_REPOSITORY_TAGS,
                                          writeTags,
                                          {value: parameters.repositoryTags},
                                          {}),
            //"":// TODO: Write Description of Repository,
            //"":// TODO: Write Table Of Content,
            "maintainers": new WriterWrapperImpl(WRITER_REPOSITORY_MAINTAINERS,
                                                 writeMaintainers,
                                                 {value: parameters.repositoryMaintainers},
                                                 {}),
            "repoInfo": new WriterWrapperImpl(WRITER_REPOSITORY_INFORMATION,
                                              writeRepositoryCommonInfo,
                                              {value: parameters.repositoryInformation},
                                              {}),
            "accounts": new WriterWrapperImpl(WRITER_ACCOUNTS,
                                              writeAccountInfo,
                                              {value: parameters.accountsInformation},
                                              {}),
            //"":// TODO: Write Design of The Artifact /link to diagram/diagramPicture,
            "amountOfResources": new WriterWrapperImpl(WRITER_AMOUNT_OF_RESOURCES,
                                                       writeAmountOfResources,
                                                       {value: documentResourcesTree},
                                                       {}),
            "listOfResources": new WriterWrapperImpl(WRITER_LIST_OF_MAIN_RESOURCES,
                                                     writeListOfResources,
                                                     {value: documentResourcesTree},
                                                     {}),
            "apiGateway": new WriterWrapperImpl(WRITER_AWS_API_GATEWAY,
                                                writeAwsApiGateways,
                                                {value: documentResourcesTree},
                                                {}),
            "eventBus": new WriterWrapperImpl(WRITER_AWS_EVENT_BUS,
                                              writeEventBuses,
                                              {value: documentResourcesTree},
                                              {}),
            "eventRules": new WriterWrapperImpl(WRITER_AWS_EVENT_RULE,
                                                writeEventRules,
                                                {value: documentResourcesTree},
                                                {}),
            "dynamodb": new WriterWrapperImpl(WRITER_AWS_DYNAMO_DB,
                                              writeDynamoDbTables,
                                              {value: documentResourcesTree},
                                              {}),
            "lambda": new WriterWrapperImpl(WRITER_AWS_LAMBDA,
                                            writeLambdaFunctions,
                                            {value: documentResourcesTree},
                                            {enableEnvVarValues: parameters.enableLambdaEnvVarValues}),
            "sqs": new WriterWrapperImpl(WRITER_AWS_SQS, writeSqsQueues, {value: documentResourcesTree}, {}),
            "sns": new WriterWrapperImpl(WRITER_AWS_SNS, writeSnsTopics, {value: documentResourcesTree}, {}),
            "stepFunctions": new WriterWrapperImpl(WRITER_AWS_STEP_FUNCTION,
                                                   writeStepFunctions,
                                                   {value: documentResourcesTree},
                                                   {
                                                       enableStepFunctionDefinition: parameters.enableStepFunctionDefinition,
                                                       enableStepFunctionDiagramLinkTemplate: parameters.enableStepFunctionDiagramLinkTemplate,
                                                   }),
            "s3": new WriterWrapperImpl(WRITER_AWS_S3, writeS3Buckets, {value: documentResourcesTree}, {}),
            "customs": new WriterWrapperImpl(WRITER_CUSTOM_MD_TEXT,
                                             writeCustomText,
                                             {value: parameters.additionalMarkdownContent},
                                             {}),
        };
        console.log("Writers based on the passed params are created");


        const writersThatWillBeUsed: WriterWrapperImpl[] = [];
        parameters.selectedWritersNames.forEach(name => {
            const writer = ALL_AVAILABLE_WRITERS[name];
            if (writer !== undefined) {
                writersThatWillBeUsed.push(writer);
            }
        });
        console.log(`Writers filtered by those which is active. Amount ${writersThatWillBeUsed.length}`);

        return createMarkdownDocumentBasedOnTheWriters(writersThatWillBeUsed);
    } catch (e) {
        console.log("Error happened during parsing json and creating markdown document");
        console.log(e);
    }
    return "";
}