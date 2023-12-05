import { DocumentResourcesTree }                                               from "./mapper/models/models";
import { parseCloudForgeTemplate, ResourcesMappedById, ResourcesMappedByType } from "../aws/parser";
import { mapAwsResourcesToMdTypes }                                            from "./mapper";
import { createMarkdownDocumentBasedOnTheWriters, WriterWrapperImpl }          from "./aws_md_writer";
import { writeListOfResources }                                                from "./writers/resources_list_writer";
import {
    writeAmountOfResources,
}                                                                              from "./writers/aws_template_related/amount_writer";
import {
    writeAwsApiGateways,
}                                                                              from "./writers/aws_template_related/api_gateway_writer";
import {
    writeEventBuses,
}                                                                              from "./writers/aws_template_related/event_bus_writer";
import {
    writeEventRules,
}                                                                              from "./writers/aws_template_related/event_rule_writer";
import {
    writeDynamoDbTables,
}                                                                              from "./writers/aws_template_related/dynamodb_writer";
import {
    writeLambdaFunctions,
}                                                                              from "./writers/aws_template_related/lambda_writer";
import {
    writeSqsQueues,
}                                                                              from "./writers/aws_template_related/sqs_writer";
import {
    writeSnsTopics,
}                                                                              from "./writers/aws_template_related/sns_writer";
import {
    writeStepFunctions,
}                                                                              from "./writers/aws_template_related/stepfunction_writer";
import {
    writeS3Buckets,
}                                                                              from "./writers/aws_template_related/s3_writer";
import { writeAccountInfo }                                                    from "./writers/account_info_writer";
import { writeRepositoryName }                                                 from "./writers/repository_name_writer";
import { writeTags }                                                           from "./writers/tag_writer";
import { writeMaintainers }                                                    from "./writers/maintainers_writer";
import { writeRepositoryCommonInfo }                                           from "./writers/repository_info_writer";
import { writeCustomText }                                                     from "./writers/md_writer";
import {
    writeRepositoryDescription,
}                                                                              from "./writers/repository_description_writer";
import {
    TABLE_OF_CONTENT_MARKER_TEXT,
    writeTableOfContentMarker,
}                                                                              from "./writers/document_table_of_content_marker_writer";
import {
    writeArtifactDesign,
}                                                                              from "./writers/artifact_design_section_writer";
import { ParserParameters }                                                    from "./writers/customs/models";
import {
    writeTableOfContent,
}                                                                              from "./writers/document_table_of_content_writer";
import { writeRelatedProjects }                                                from "./writers/related_projects_writer";

const WRITER_REPOSITORY_NAME = "repositoryName";
const WRITER_REPOSITORY_TAGS = "tags";
const WRITER_REPOSITORY_DESCRIPTION = "repoDescription";
const WRITER_REPOSITORY_TABLE_OF_CONTENT = "tableOfContent";
const WRITER_REPOSITORY_MAINTAINERS = "maintainers";
const WRITER_REPOSITORY_INFORMATION = "repoInfo";
const WRITER_ACCOUNTS = "accounts";
const WRITER_DESIGN_INFO = "designInfo";
const WRITER_RELATED_PROJECTS = "relatedProjects";
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

export const AVAILABLE_WRITERS: string[] = [
    WRITER_REPOSITORY_NAME,
    WRITER_REPOSITORY_TAGS,
    WRITER_REPOSITORY_DESCRIPTION,
    WRITER_REPOSITORY_TABLE_OF_CONTENT,
    WRITER_REPOSITORY_MAINTAINERS,
    WRITER_REPOSITORY_INFORMATION,
    WRITER_ACCOUNTS,
    WRITER_DESIGN_INFO,
    WRITER_RELATED_PROJECTS,
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
    const parsedCloudFormationTemplate: [ResourcesMappedByType, ResourcesMappedById] = parseCloudForgeTemplate(
        parameters.templateJsonValue,
        parameters.parserConfig.templateResourceNamePrefixToRemove,
        parameters.parserConfig.templateResourceNameSuffixToRemove,
    );
    console.log("Cloud Formation JSON parsed");

    const documentResourcesTree: DocumentResourcesTree = mapAwsResourcesToMdTypes(parsedCloudFormationTemplate);
    console.log("Parsed Cloud Formation JSON is mapped to DocumentResourcesTree");

    const ALL_AVAILABLE_WRITERS: { [key: string]: WriterWrapperImpl } = {
        "repositoryName": new WriterWrapperImpl(WRITER_REPOSITORY_NAME,
                                                writeRepositoryName,
                                                {value: parameters.repositoryInformation.name},
                                                {}),
        "tags": new WriterWrapperImpl(WRITER_REPOSITORY_TAGS,
                                      writeTags,
                                      {value: parameters.repositoryTags},
                                      {}),
        "repoDescription": new WriterWrapperImpl(WRITER_REPOSITORY_DESCRIPTION,
                                                 writeRepositoryDescription,
                                                 {value: parameters.repositoryInformation.description},
                                                 {}),
        "tableOfContent": new WriterWrapperImpl(WRITER_REPOSITORY_TABLE_OF_CONTENT,
                                                writeTableOfContentMarker,
                                                {value: ""},
                                                {}),
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
        "designInfo": new WriterWrapperImpl(WRITER_DESIGN_INFO,
                                            writeArtifactDesign,
                                            {value: parameters.artifactDesign},
                                            {}),
        "relatedProjects": new WriterWrapperImpl(WRITER_RELATED_PROJECTS,
                                                 writeRelatedProjects,
                                                 {value: parameters.relatedProjects},
                                                 {}),
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
                                            {
                                                "showOpenApiStub": parameters.otherAppConfig.showOpenApiStub,
                                                "showApiGatewayUsageInstructionStub": parameters.otherAppConfig.showApiGatewayUsageInstructionStub,
                                                "showPostmanStub": parameters.otherAppConfig.showPostmanStub,
                                                "showPostmanSecretsLink": parameters.otherAppConfig.showPostmanSecretsLink,
                                                "showApiMaintainerColumn": parameters.otherAppConfig.showApiMaintainerColumn,
                                                "showApiDocsLinkColumn": parameters.otherAppConfig.showApiDocsLinkColumn,
                                            }),
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
                                          {
                                              CREATE_DATA_EXAMPLE_STUB: parameters.parserConfig.enableDynamoDbExampleStubs,
                                          }),
        "lambda": new WriterWrapperImpl(WRITER_AWS_LAMBDA,
                                        writeLambdaFunctions,
                                        {value: documentResourcesTree},
                                        {enableEnvVarValues: parameters.parserConfig.enableLambdaEnvVarValues}),
        "sqs": new WriterWrapperImpl(WRITER_AWS_SQS, writeSqsQueues, {value: documentResourcesTree}, {}),
        "sns": new WriterWrapperImpl(WRITER_AWS_SNS, writeSnsTopics, {value: documentResourcesTree}, {}),
        "stepFunctions": new WriterWrapperImpl(WRITER_AWS_STEP_FUNCTION,
                                               writeStepFunctions,
                                               {value: documentResourcesTree},
                                               {
                                                   enableStepFunctionDefinition: parameters.parserConfig.enableStepFunctionDefinition,
                                                   enableStepFunctionDiagramLinkTemplate: parameters.otherAppConfig.enableArchitectureDiagramImgLinkTemplate,
                                               }),
        "s3": new WriterWrapperImpl(WRITER_AWS_S3, writeS3Buckets, {value: documentResourcesTree}, {}),
        "customs": new WriterWrapperImpl(WRITER_CUSTOM_MD_TEXT,
                                         writeCustomText,
                                         {value: parameters.additionalMarkdownContent},
                                         {}),
    };
    console.log("Writers based on the passed params are created");


    const writersThatWillBeUsed: WriterWrapperImpl[] = [];
    parameters.otherAppConfig.selectedWriters.forEach(name => {
        const writer = ALL_AVAILABLE_WRITERS[name];
        if (writer !== undefined) {
            writersThatWillBeUsed.push(writer);
        }
    });
    console.log(`Writers filtered by those which is active. Amount ${writersThatWillBeUsed.length}`);

    let mdDocumentContent = createMarkdownDocumentBasedOnTheWriters(writersThatWillBeUsed);

    if (writersThatWillBeUsed.find(item => item.Name === WRITER_REPOSITORY_TABLE_OF_CONTENT) !== undefined) {
        const result = writeTableOfContent({value: mdDocumentContent});
        mdDocumentContent = mdDocumentContent.replace(TABLE_OF_CONTENT_MARKER_TEXT, result);
    }

    return mdDocumentContent;
}