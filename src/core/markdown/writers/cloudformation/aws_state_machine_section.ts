import { AdditionalConfigs, MarkdownWriterFunc }                          from "../common";
import {
    DocumentResourcesTree,
}                                                                         from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                                                   from "../../../common_utils";
import { DEFAULT_OTHER_APP_CONFIGURATION }                                from "../../../config/constatns";
import {
    MappedState,
    MappedStateMachineDefinition,
    MappedStepFunctionsStateMachine,
}                                                                         from "../../../mapping/models/mapped_aws_stepfunctions";
import { mdCreateLink, mdMakeCodeBlock, mdMakeContentBlock, mdMakeTable } from "../../utils";
import { MDCodeSyntax, MDHeader, NEW_LINE }                               from "../../constants";

export const SHOW_STEP_FUNCTION_DEFINITION = "showStepFunctionDefinition";
export const SHOW_STEP_FUNCTION_STEPS = "showStepFunctionSteps";
export const ADD_STEP_FUNCTION_DESIGN_IMG_STUB = "addStepFunctionDesignImgStub";

type Configuration = {
    showStepFunctionDefinition: boolean;
    showStepFunctionSteps: boolean;
    addStepFunctionDesignImgStub: boolean;
}

export const createAwsStateMachinesSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        return "";
    }

    const stateMachines = dataValue.getMappedStepFunctionsStateMachine();
    if (isEmptyArray(stateMachines)) {
        return "";
    }


    let showStepFunctionDefinition: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showStepFunctionDefinition;
    let showStepFunctionSteps: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showStepFunctionSteps;
    let addStepFunctionDesignImgStub: boolean = DEFAULT_OTHER_APP_CONFIGURATION.addStepFunctionDesignImgStub;

    if (additionalConfigs !== undefined) {
        showStepFunctionDefinition = additionalConfigs[SHOW_STEP_FUNCTION_DEFINITION] ?? showStepFunctionDefinition;
        showStepFunctionSteps = additionalConfigs[SHOW_STEP_FUNCTION_STEPS] ?? showStepFunctionSteps;
        addStepFunctionDesignImgStub = additionalConfigs[ADD_STEP_FUNCTION_DESIGN_IMG_STUB] ?? addStepFunctionDesignImgStub;
    }

    const configuration: Configuration = {
        showStepFunctionDefinition,
        showStepFunctionSteps,
        addStepFunctionDesignImgStub,
    };

    return createMarkdownContent(stateMachines, configuration);
};

function createMarkdownContent(stateMachines: MappedStepFunctionsStateMachine[], configuration: Configuration): string {
    const content: string[] = stateMachines
        .map(stateMachine => createStateMachineDescription(stateMachine, configuration));

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

    const tableHeader: string[] = ["StateID", "StateType", "Resource", "Next", "Order", "Retry", "Catch"];
    const tableValues: string[][] = [];

    for (const step of allSteps) {
        const stateId = step.StateID;

        const isFirstStep: boolean = firstStep === stateId;
        const isLastStep: boolean = step.End ?? false;
        const order = isFirstStep ? "First" : isLastStep ? "Last" : "";

        const stateType = step.StateType;
        const resource = step?.Resource?.resourceName ?? "";

        let next: string = "";
        if (step.Next !== undefined) {
            if (typeof step.Next === "string") {
                next = step.Next;
            } else if (Array.isArray(step.Next)) {
                next = step.Next.join(" or ");
            } else {
                console.warn(step.Next);
                throw Error("state.Next has wrong type. Check console for details");
            }
        }

        let retry = "";
        if (step.Retry !== undefined) {
            retry = JSON.stringify(step.Retry);
        }
        let stepCatch = "";
        if (step.Catch !== undefined) {
            stepCatch = JSON.stringify(step.Catch);
        }

        tableValues.push([stateId, stateType, resource, next, order, retry, stepCatch]);
    }

    const stateMachineStatesTable = mdMakeTable(tableHeader, tableValues);

    return mdMakeContentBlock(stateMachineStatesTable, "State Machine States", MDHeader.HEADER_LEVEL_4);
}
