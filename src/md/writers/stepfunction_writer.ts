import {
    AwsWriterFunction,
    CodeSyntax,
    createContentBlock,
    createMdCodeBlock,
    MdHeader,
    NEW_LINE,
    WriterOptions,
}                                                           from "./common/common_md_functions";
import { DocumentResourcesTree, StepFunctionsStateMachine } from "../models/models";

function createStepFunctionContent(stepFunctionsStateMachines: StepFunctionsStateMachine[]): string {
    const resultString: string[] = [];

    stepFunctionsStateMachines.forEach(stepFunction => {
        const sfDefinitionJsonString: string = JSON.stringify(JSON.parse(stepFunction.definition), null, 2);
        const codeBlock: string = createMdCodeBlock(sfDefinitionJsonString, CodeSyntax.JSON);

        resultString.push(createContentBlock(stepFunction.name, MdHeader.HEADER_LEVEL_3, codeBlock));
    });

    return resultString.join(NEW_LINE);
}

export const writeStepFunctions: AwsWriterFunction = (resourcesList: DocumentResourcesTree, options?: WriterOptions): string => {
    const stepFunctionsStateMachines = resourcesList.mappedStepFunctionsStateMachine;
    if (stepFunctionsStateMachines === undefined || stepFunctionsStateMachines.length === 0) {
        return "";
    }

    const content: string = createStepFunctionContent(stepFunctionsStateMachines);
    return createContentBlock("AWS Step Function Information", MdHeader.HEADER_LEVEL_2, content);
};