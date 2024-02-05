import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import {
    DocumentResourcesTree,
}                                                from "../../../mapping/models/mapped_tree";
import {
    isEmptyArray,
}                                                from "../../../common_utils";
import {
    DEFAULT_BACKOFF_RATE,
    DEFAULT_INTERVAL_SECONDS,
    DEFAULT_MAX_ATTEMPTS,
    DEFAULT_OTHER_APP_CONFIGURATION,
}                                                from "../../../config/constatns";
import {
    MappedState,
    MappedStateMachineDefinition,
    MappedStepFunctionsStateMachine,
}                                                from "../../../mapping/models/mapped_aws_stepfunctions";
import {
    mdAddStyleToText,
    mdCreateLink,
    mdMakeCodeBlock,
    mdMakeContentBlock,
    mdMakeList,
    mdMakeTable,
}                                                from "../../utils";
import {
    MDCodeSyntax,
    MDHeader,
    MDTextStyle,
    NEW_LINE,
}                                                from "../../constants";
import logger                                    from "../../../../logger";
import {
    isEmptyString,
}                                                from "../../../string_utils";

export const SHOW_STEP_FUNCTION_DEFINITION = "showStepFunctionDefinition";
export const SHOW_STEP_FUNCTION_STEPS = "showStepFunctionSteps";
export const SHOW_STEP_FUNCTION_STEPS_DETAILS = "showStepFunctionStepsDetails";
export const ADD_STEP_FUNCTION_DESIGN_IMG_STUB = "addStepFunctionDesignImgStub";

type Configuration = {
    showStepFunctionDefinition: boolean;
    showStepFunctionSteps: boolean;
    showStepFunctionStepsDetails: boolean;
    addStepFunctionDesignImgStub: boolean;
}

export const createAwsStateMachinesSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsStateMachinesSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const stateMachines = dataValue.getMappedStepFunctionsStateMachine();
    if (isEmptyArray(stateMachines)) {
        logger.debug({},
                     "createAwsStateMachinesSectionText. stateMachines is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsStateMachinesSectionText. input values");

    let showStepFunctionDefinition: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showStepFunctionDefinition;
    let showStepFunctionSteps: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showStepFunctionSteps;
    let showStepFunctionStepsDetails: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showStepFunctionStepsDetails;
    let addStepFunctionDesignImgStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addStepFunctionDesignImgStub;

    if (additionalConfigs !== undefined) {
        showStepFunctionDefinition = additionalConfigs[SHOW_STEP_FUNCTION_DEFINITION] ?? showStepFunctionDefinition;
        showStepFunctionStepsDetails = additionalConfigs[SHOW_STEP_FUNCTION_STEPS_DETAILS] ?? showStepFunctionStepsDetails;
        showStepFunctionSteps = additionalConfigs[SHOW_STEP_FUNCTION_STEPS] ?? showStepFunctionSteps;
        addStepFunctionDesignImgStub = additionalConfigs[ADD_STEP_FUNCTION_DESIGN_IMG_STUB] ?? addStepFunctionDesignImgStub;
    }

    const configuration: Configuration = {
        showStepFunctionDefinition,
        showStepFunctionSteps,
        addStepFunctionDesignImgStub,
        showStepFunctionStepsDetails,
    };

    return createMarkdownContent(stateMachines, configuration);
};

function createMarkdownContent(stateMachines: MappedStepFunctionsStateMachine[], configuration: Configuration): string {
    const content: string[] = stateMachines.map(stateMachine =>
                                                    createStateMachineDescription(stateMachine, configuration));

    return mdMakeContentBlock(content.join(NEW_LINE), "AWS Step Function Information");
}

function createStateMachineDescription(stateMachine: MappedStepFunctionsStateMachine, configuration: Configuration): string {
    const content: string[] = [];

    if (configuration.showStepFunctionDefinition) {
        const definitionContent = createStateMachineDefinitionJsonBlock(stateMachine);
        content.push(definitionContent);
    }
    if (configuration.showStepFunctionSteps) {
        const stateMachineStepsTable = createStateMachineStepsTable(stateMachine.definitionObj);
        content.push(stateMachineStepsTable);
    }
    if (configuration.showStepFunctionStepsDetails) {
        const stateMachineStepsDetails = createStateMachineStepsDetailsList(stateMachine.definitionObj);
        content.push(stateMachineStepsDetails);
    }
    if (configuration.addStepFunctionDesignImgStub) {
        const diagramLinkStub = mdCreateLink("TODO:", `${stateMachine.name} diagram`);
        content.push(diagramLinkStub);
    }

    return mdMakeContentBlock(content.join(NEW_LINE), stateMachine.name, MDHeader.HEADER_LEVEL_3);
}

function createStateMachineDefinitionJsonBlock(stateMachine: MappedStepFunctionsStateMachine) {
    const stateMachineDefinitionString: string = stateMachine.definition;
    const stateMachineDefinitionObj: any = JSON.parse(stateMachineDefinitionString);
    const prettyStateMachineDefinition: string = JSON.stringify(stateMachineDefinitionObj, null, 2);
    const definitionCodeBlock: string = mdMakeCodeBlock(prettyStateMachineDefinition, MDCodeSyntax.JSON);

    return mdMakeContentBlock(definitionCodeBlock, "State Machine Definition JSON", MDHeader.HEADER_LEVEL_4);
}

function createStateMachineStepsTable(definitionObj: MappedStateMachineDefinition): string {
    const firstStep: string = definitionObj.StartAt;
    const allSteps: MappedState[] = definitionObj.States;

    const tableHeader: string[] = ["StateID", "StateType", "Resource", "Next", "Order"];
    const tableValues: string[][] = [];

    for (const step of allSteps) {
        const stateId = step.StateID;

        const isFirstStep: boolean = firstStep === stateId;
        const isLastStep: boolean = step.End ?? false;
        const order = isFirstStep ? "First" : isLastStep ? "Last" : "";

        const stateType = step.StateType;
        const resource = step?.Resource?.resourceName ?? "";
        const next = getNameOfTheNextStep(step);

        tableValues.push([stateId, stateType, resource, next, order]);
    }

    const stateMachineStatesTable = mdMakeTable(tableHeader, tableValues);

    return mdMakeContentBlock(stateMachineStatesTable, "State Machine States", MDHeader.HEADER_LEVEL_4);
}

function createStateMachineStepsDetailsList(definitionObj: MappedStateMachineDefinition): string {
    const allSteps: MappedState[] = definitionObj.States;

    const mappedSteps: string[] = allSteps.map(step => {
        const resultText: string[] = [];

        const next: string = mdAddStyleToText(getNameOfTheNextStep(step), MDTextStyle.BOLD_ITALIC);

        if (!isEmptyString(next)) {
            resultText.push(`${NEW_LINE}The next step can be one of the list: ${next}${NEW_LINE}`);
        }

        if (step.Catch !== undefined) {
            const catches: string[] = step.Catch?.map(catchItem => {
                const errors = catchItem.ErrorEquals;
                const nextStep = mdAddStyleToText(catchItem.Next, MDTextStyle.BOLD_ITALIC);
                const errorsList = errors.join(",");
                return mdMakeContentBlock(`Catch Configuration for: ${mdAddStyleToText(errorsList,
                                                                                       MDTextStyle.BOLD)} => ${nextStep}`);
            });
            resultText.push(mdMakeContentBlock(catches.join(NEW_LINE)));
        }

        if (step.Retry !== undefined) {
            const retries: string[] = step.Retry?.map(retry => {
                const errorsToRetry = retry.ErrorEquals;
                const errorsList = errorsToRetry.join(",");
                const header = `Retry logic for: ${mdAddStyleToText(errorsList, MDTextStyle.BOLD)}`;

                const backoffRate = `${retry.BackoffRate ?? DEFAULT_BACKOFF_RATE}`;
                const intervalSeconds = `${retry.IntervalSeconds ?? DEFAULT_INTERVAL_SECONDS}`;
                const maxAttempts = `${retry.MaxAttempts ?? DEFAULT_MAX_ATTEMPTS}`;
                const jitterStrategy = `${retry.JitterStrategy || ""}`;
                const maxDelaySeconds = `${retry.MaxDelaySeconds ?? ""}`;

                const valuesForTheList: string[] = [];
                valuesForTheList.push(`BackoffRate - ${backoffRate}`);
                valuesForTheList.push(`IntervalSeconds - ${intervalSeconds}`);
                valuesForTheList.push(`MaxAttempts - ${maxAttempts}`);

                if (!isEmptyString(jitterStrategy)) {
                    valuesForTheList.push(`JitterStrategy - ${jitterStrategy}`);
                }
                if (!isEmptyString(maxDelaySeconds)) {
                    valuesForTheList.push(`MaxDelaySeconds - ${maxDelaySeconds}`);
                }

                const list = mdMakeList(valuesForTheList);

                const content: string[] = [];
                content.push(header);
                content.push(NEW_LINE);
                content.push(mdAddStyleToText(`Configuration of retry logic`, MDTextStyle.ITALIC));
                content.push(list);

                return mdMakeContentBlock(content.join(NEW_LINE));
            });
            resultText.push(retries.join(NEW_LINE));
        }

        if (step.StateType === "Choice") {
            const defaultPath = step.Default ?? "";
            const rules = step.Choices?.map(ch => {
                return mdMakeCodeBlock(ch, MDCodeSyntax.JSON);
            }) ?? [];

            if (!isEmptyString(defaultPath)) {
                resultText.push(`Choice has default path: ${mdAddStyleToText(defaultPath, MDTextStyle.BOLD)}`);
            }
            resultText.push(rules?.join(NEW_LINE));
        }

        if (step.StateType === "Map") {
            if (step.ItemProcessor !== undefined) {
                const startAt = mdAddStyleToText(step.ItemProcessor.StartAt, MDTextStyle.BOLD);
                const states = step.ItemProcessor.States.map(s => {
                    const stateID = mdAddStyleToText(s.StateID, MDTextStyle.BOLD_ITALIC);
                    const stateType = mdAddStyleToText(s.StateType, MDTextStyle.BOLD_ITALIC);
                    const resourceName = mdAddStyleToText(s.Resource?.resourceName ?? "", MDTextStyle.BOLD_ITALIC);
                    return `${stateID}, Task Type - ${stateType}, Resource ${resourceName}`;
                });
                resultText.push(`First step name: ${startAt}${NEW_LINE}`);
                resultText.push(mdMakeList(states));
            }
        }

        const stepName = step.StateID;
        return mdMakeContentBlock(resultText.join(NEW_LINE),
                                  `${step.StateType} - ${stepName}`,
                                  MDHeader.HEADER_LEVEL_5);
    });

    return mdMakeContentBlock(mappedSteps.join(NEW_LINE), "State Machine States Details", MDHeader.HEADER_LEVEL_4);
}

function getNameOfTheNextStep(step: MappedState) {
    let next: string = "";
    if (step.Next !== undefined) {
        if (typeof step.Next === "string") {
            next = step.Next;
        } else if (Array.isArray(step.Next)) {
            next = step.Next.join(" or ");
        } else {
            logger.warn(step.Next);
            throw Error("state.Next has wrong type. Check console for details");
        }
    }
    return next;
}
