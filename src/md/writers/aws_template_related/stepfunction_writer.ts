import {
    CodeSyntax,
    createContentBlock,
    createLink,
    createMdCodeBlock,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                           from "../common/common_md_functions";
import { DocumentResourcesTree, StepFunctionsStateMachine } from "../../mapper/models/models";

function createStepFunctionContent(stepFunctionsStateMachines: StepFunctionsStateMachine[],
                                   enableStepFunctionDefinition: boolean,
                                   enableStepFunctionDiagramLinkTemplate: boolean): string {
    const resultString: string[] = [];

    stepFunctionsStateMachines.forEach(stepFunction => {
        let definition: string = "";
        let linkToDiagram: string = "";

        if (enableStepFunctionDefinition) {
            const sfDefinitionJsonString: string = JSON.stringify(JSON.parse(stepFunction.definition), null, 2);
            definition = createMdCodeBlock(sfDefinitionJsonString, CodeSyntax.JSON);
        }
        if (enableStepFunctionDiagramLinkTemplate) {
            linkToDiagram = createLink(`${stepFunction.name} diagram`, "TODO");
        }
        const content = [definition, linkToDiagram].join(NEW_LINE);
        resultString.push(createContentBlock(stepFunction.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultString.join(NEW_LINE);
}

export const writeStepFunctions: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const stepFunctionsStateMachines = params.value.mappedStepFunctionsStateMachine;
    if (stepFunctionsStateMachines === undefined || stepFunctionsStateMachines.length === 0) {
        return "";
    }

    let enableStepFunctionDefinition: boolean = false;
    let enableStepFunctionDiagramLinkTemplate: boolean = false;

    if (options) {
        enableStepFunctionDefinition = options["enableStepFunctionDefinition"] ?
                                       options["enableStepFunctionDefinition"] :
                                       false;
        enableStepFunctionDiagramLinkTemplate = options["enableStepFunctionDiagramLinkTemplate"] ?
                                                options["enableStepFunctionDiagramLinkTemplate"] :
                                                false;
    }

    const content: string = createStepFunctionContent(stepFunctionsStateMachines,
                                                      enableStepFunctionDefinition,
                                                      enableStepFunctionDiagramLinkTemplate);
    return createContentBlock("AWS Step Function Information", MdHeader.HEADER_LEVEL_2, content);
};