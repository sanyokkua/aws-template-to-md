import { ParsingConfiguration } from "../config/models";
import {
    DocumentResourcesTree,
}                               from "../mapping/models/mapped_tree";
import {
    AMOUNT_OF_AWS_RESOURCES,
    API_GATEWAY,
    CUSTOMS,
    DESIGN,
    DYNAMO_DB,
    ENVIRONMENTS,
    ESSENTIAL_REPOSITORY_INFORMATION,
    EVENT_BUS,
    EVENT_RULES,
    LAMBDA,
    MAIN_AWS_RESOURCES_DIAGRAM,
    RELATED_PROJECTS,
    REPOSITORY_DESCRIPTION,
    REPOSITORY_MAINTAINERS,
    REPOSITORY_NAME,
    REPOSITORY_TAGS,
    S3,
    SNS,
    SQS,
    STATE_MACHINE,
    TABLE_OF_CONTENT,
}                               from "../config/constatns";
import {
    createRepositoryNameSectionText,
}                               from "./writers/generic/repository_name_section";
import {
    createRepositoryTagsSectionText,
}                               from "./writers/generic/repository_tags_section";
import {
    createRepositoryDescriptionSectionText,
}                               from "./writers/generic/repository_description_section";
import {
    createTableOfContentSectionText,
    replaceTableOfContentMarker,
}                               from "./writers/generic/table_of_content_section";
import {
    createRepositoryMaintainersSectionText,
}                               from "./writers/generic/repository_maintainers_section";
import {
    createRepositoryUsefulInformationSectionText,
}                               from "./writers/generic/repository_useful_information_section";
import {
    createAccountInformationSectionText,
}                               from "./writers/generic/environments_section";
import {
    createSolutionDesignSectionText,
}                               from "./writers/generic/solution_design_section";
import {
    createRelatedProjectsSectionText,
}                               from "./writers/generic/related_projects_section";
import {
    createAwsAmountOfResourceSectionText,
}                               from "./writers/cloudformation/aws_resources_amount_section";
import {
    createAwsDiagramResourcesSectionText,
}                               from "./writers/cloudformation/aws_resources_on_diagram_section";
import {
    ADD_API_GATEWAY_USAGE_INSTRUCTION_STUB,
    ADD_OPEN_API_LINK_STUB,
    ADD_POSTMAN_LINK_STUB,
    ADD_POSTMAN_SECRETS_LINK_STUB,
    createAwsApiGatewaysSectionText,
    SHOW_API_GATEWAY_ENDPOINT_DOCS_LINK_COLUMN,
    SHOW_API_GATEWAY_ENDPOINT_MAINTAINER_COLUMN,
}                               from "./writers/cloudformation/aws_api_gateway_section";
import {
    createAwsEventBusSectionText,
}                               from "./writers/cloudformation/aws_event_bus_section";
import {
    createAwsEventsRulesSectionText,
}                               from "./writers/cloudformation/aws_event_rules_section";
import {
    ADD_DYNAMO_DB_EXAMPLES_STUB,
    createAwsDynamoDBsSectionText,
}                               from "./writers/cloudformation/aws_dynamo_db_section";
import {
    createAwsLambdaFunctionsSectionText,
    SHOW_LAMBDA_VARS,
    SHOW_LAMBDA_VARS_VALUES,
}                               from "./writers/cloudformation/aws_lambda_function_section";
import {
    createAwsSqsSectionText,
}                               from "./writers/cloudformation/aws_sqs_section";
import {
    createAwsSnsSectionText,
}                               from "./writers/cloudformation/aws_sns_section";
import {
    ADD_STEP_FUNCTION_DESIGN_IMG_STUB,
    createAwsStateMachinesSectionText,
    SHOW_STEP_FUNCTION_DEFINITION,
    SHOW_STEP_FUNCTION_STEPS,
    SHOW_STEP_FUNCTION_STEPS_DETAILS,
}                               from "./writers/cloudformation/aws_state_machine_section";
import {
    createAwsS3SectionText,
}                               from "./writers/cloudformation/aws_s3_section";
import {
    createCustomMarkdownSectionText,
}                               from "./writers/generic/custom_markdown_section";
import { NEW_LINE }             from "./constants";
import { isEmptyString }        from "../string_utils";
import logger                   from "../../logger";

export function createMarkdownDocument(parsingConfiguration: ParsingConfiguration, documentResourcesTree: DocumentResourcesTree): string {
    logger.debug({parsingConfiguration, documentResourcesTree}, "createMarkdownDocument. Input Values");
    const selectedWriters = parsingConfiguration.otherAppConfiguration.selectedMarkdownSections;
    const resultLines: string[] = [];

    for (const writerName of selectedWriters) {
        logger.debug(writerName, "createMarkdownDocument. Writer Name that will be used");
        switch (writerName) {
            case REPOSITORY_NAME: {
                resultLines.push(createRepositoryNameSectionText(parsingConfiguration.repositoryInfo.repositoryName));
                break;
            }
            case REPOSITORY_TAGS: {
                resultLines.push(createRepositoryTagsSectionText(parsingConfiguration.repositoryTags));
                break;
            }
            case REPOSITORY_DESCRIPTION: {
                resultLines.push(createRepositoryDescriptionSectionText(parsingConfiguration.repositoryInfo.repositoryDescription));
                break;
            }
            case TABLE_OF_CONTENT: {
                resultLines.push(createTableOfContentSectionText(""));
                break;
            }
            case REPOSITORY_MAINTAINERS: {
                resultLines.push(createRepositoryMaintainersSectionText(parsingConfiguration.repositoryMaintainers));
                break;
            }
            case ESSENTIAL_REPOSITORY_INFORMATION: {
                resultLines.push(createRepositoryUsefulInformationSectionText(parsingConfiguration.repositoryInfo));
                break;
            }
            case ENVIRONMENTS: {
                resultLines.push(createAccountInformationSectionText(parsingConfiguration.accountInformationList));
                break;
            }
            case DESIGN: {
                resultLines.push(createSolutionDesignSectionText(parsingConfiguration.designInformation));
                break;
            }
            case RELATED_PROJECTS: {
                resultLines.push(createRelatedProjectsSectionText(parsingConfiguration.relatedProjects));
                break;
            }
            case AMOUNT_OF_AWS_RESOURCES: {
                resultLines.push(createAwsAmountOfResourceSectionText(documentResourcesTree));
                break;
            }
            case MAIN_AWS_RESOURCES_DIAGRAM: {
                resultLines.push(createAwsDiagramResourcesSectionText(documentResourcesTree));
                break;
            }
            case API_GATEWAY: {
                resultLines.push(createAwsApiGatewaysSectionText(documentResourcesTree, {
                    [SHOW_API_GATEWAY_ENDPOINT_MAINTAINER_COLUMN]: parsingConfiguration.otherAppConfiguration[SHOW_API_GATEWAY_ENDPOINT_MAINTAINER_COLUMN],
                    [SHOW_API_GATEWAY_ENDPOINT_DOCS_LINK_COLUMN]: parsingConfiguration.otherAppConfiguration[SHOW_API_GATEWAY_ENDPOINT_DOCS_LINK_COLUMN],
                    [ADD_API_GATEWAY_USAGE_INSTRUCTION_STUB]: parsingConfiguration.otherAppConfiguration[ADD_API_GATEWAY_USAGE_INSTRUCTION_STUB],
                    [ADD_OPEN_API_LINK_STUB]: parsingConfiguration.otherAppConfiguration[ADD_OPEN_API_LINK_STUB],
                    [ADD_POSTMAN_LINK_STUB]: parsingConfiguration.otherAppConfiguration[ADD_POSTMAN_LINK_STUB],
                    [ADD_POSTMAN_SECRETS_LINK_STUB]: parsingConfiguration.otherAppConfiguration[ADD_POSTMAN_SECRETS_LINK_STUB],
                }));
                break;
            }
            case EVENT_BUS: {
                resultLines.push(createAwsEventBusSectionText(documentResourcesTree));
                break;
            }
            case EVENT_RULES: {
                resultLines.push(createAwsEventsRulesSectionText(documentResourcesTree));
                break;
            }
            case DYNAMO_DB: {
                resultLines.push(createAwsDynamoDBsSectionText(documentResourcesTree, {
                    [ADD_DYNAMO_DB_EXAMPLES_STUB]: parsingConfiguration.otherAppConfiguration[ADD_DYNAMO_DB_EXAMPLES_STUB],
                }));
                break;
            }
            case LAMBDA: {
                resultLines.push(createAwsLambdaFunctionsSectionText(documentResourcesTree, {
                    [SHOW_LAMBDA_VARS]: parsingConfiguration.otherAppConfiguration[SHOW_LAMBDA_VARS],
                    [SHOW_LAMBDA_VARS_VALUES]: parsingConfiguration.otherAppConfiguration[SHOW_LAMBDA_VARS_VALUES],
                }));
                break;
            }
            case SQS: {
                resultLines.push(createAwsSqsSectionText(documentResourcesTree));
                break;
            }
            case SNS: {
                resultLines.push(createAwsSnsSectionText(documentResourcesTree));
                break;
            }
            case STATE_MACHINE: {
                resultLines.push(createAwsStateMachinesSectionText(documentResourcesTree, {
                    [SHOW_STEP_FUNCTION_DEFINITION]: parsingConfiguration.otherAppConfiguration[SHOW_STEP_FUNCTION_DEFINITION],
                    [SHOW_STEP_FUNCTION_STEPS]: parsingConfiguration.otherAppConfiguration[SHOW_STEP_FUNCTION_STEPS],
                    [SHOW_STEP_FUNCTION_STEPS_DETAILS]: parsingConfiguration.otherAppConfiguration[SHOW_STEP_FUNCTION_STEPS_DETAILS],
                    [ADD_STEP_FUNCTION_DESIGN_IMG_STUB]: parsingConfiguration.otherAppConfiguration[ADD_STEP_FUNCTION_DESIGN_IMG_STUB],
                }));
                break;
            }
            case S3: {
                resultLines.push(createAwsS3SectionText(documentResourcesTree));
                break;
            }
            case CUSTOMS: {
                resultLines.push(createCustomMarkdownSectionText(parsingConfiguration.customMarkdownText));
                break;
            }
            default:
                throw new Error(`Section writer with name = ${writerName} is not found, check console for details`);
        }
    }

    logger.debug(resultLines, "createMarkdownDocument. Generated resultLines");
    let mdDocumentContent = resultLines.filter(text => !isEmptyString(text)).join(NEW_LINE);
    logger.debug(mdDocumentContent, "createMarkdownDocument. mdDocumentContent");

    if (selectedWriters.find(item => item === TABLE_OF_CONTENT) !== undefined) {
        logger.debug(mdDocumentContent, "createMarkdownDocument. among writers was found table of content writer");
        mdDocumentContent = replaceTableOfContentMarker(mdDocumentContent);
        logger.debug(mdDocumentContent, "createMarkdownDocument. Table of content was injected");
    }

    return mdDocumentContent;
}
