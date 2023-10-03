import { createContentBlock, createMdTable, MdHeader, WriterFunction } from "./common/common";
import { DocumentResourcesTree, LambdaFunction }                       from "../models";

function getEnvVarsAsCommaSeparatedListString(lambda: LambdaFunction): string {
    let envVarsJsonString: string = lambda.envVars;

    if (envVarsJsonString !== undefined && envVarsJsonString.length > 0) {
        let parsedEnvVars;
        try {
            parsedEnvVars = JSON.parse(envVarsJsonString);
            const envVarNames: string[] = [];

            for (let key in parsedEnvVars) {
                envVarNames.push(key);
            }

            envVarsJsonString = envVarNames.join(", ");
        } catch (e) {
            console.log(e);
            envVarsJsonString = lambda.envVars;
        }
    }

    return envVarsJsonString;
}

function createLambdaContent(lambdaFunctions: LambdaFunction[]): string {
    const HEADER_LINE: string[] = ["Name", "Arch", "Runtime", "Timeout", "RAM", "/tmp Size", "Tracing", "Env Vars"];
    const tableValues: string[][] = [];

    lambdaFunctions.forEach(lambda => {
        const envVarsJsonString: string = getEnvVarsAsCommaSeparatedListString(lambda);
        tableValues.push([
                             lambda.name,
                             lambda.arch.join(", "),
                             lambda.runtime,
                             `${lambda.timeout}`,
                             `${lambda.memorySize}`,
                             `${lambda.tmpFolderMemory}`,
                             lambda.tracing,
                             envVarsJsonString,
                         ]);
    });

    return createMdTable(HEADER_LINE, tableValues);
}

export const writeLambdaFunctions: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const lambdaFunctions = resourcesList.mappedLambdaFunction;
    if (lambdaFunctions === undefined || lambdaFunctions.length === 0) {
        return "";
    }

    const content: string = createLambdaContent(lambdaFunctions);
    return createContentBlock("AWS Lambda Information", MdHeader.HEADER_LEVEL_2, content);
};