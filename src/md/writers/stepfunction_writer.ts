import { CodeSyntax, createMdCodeBlock, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree }                                               from "../models";

export const writeStepFunctions: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const stepFunctionsStateMachines = resourcesList.mappedStepFunctionsStateMachine;
    if (stepFunctionsStateMachines === undefined || stepFunctionsStateMachines.length === 0) {
        return "";
    }

    const resultString: string[] = [];
    const header = makeHeader("AWS Step Function Information", MdHeader.HEADER_LEVEL_2);
    resultString.push(header);


    stepFunctionsStateMachines.forEach(stepfunction => {
        const name = makeHeader(stepfunction.name, MdHeader.HEADER_LEVEL_4);
        const code = JSON.stringify(JSON.parse(stepfunction.definition), null, 2);
        resultString.push(`${name}\n${createMdCodeBlock(code, CodeSyntax.JSON)}`);
    });

    return resultString.join("\n");
};