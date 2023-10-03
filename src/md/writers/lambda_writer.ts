import { createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree }                               from "../models";

export const writeLambdaFunctions: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const lambdaFunctions = resourcesList.mappedLambdaFunction;
    if (lambdaFunctions === undefined || lambdaFunctions.length === 0) {
        return "";
    }

    const HEADER_LINE: string[] = [
        "Name",
        "Arch",
        "Runtime",
        "Timeout",
        "RAM",
        "/tmp Size",
        "Tracing",
        "Env Vars",
    ];
    const tableValues: string[][] = [];

    lambdaFunctions.forEach(lambda => {
        let envVars = lambda.envVars;
        if (envVars !== undefined && envVars.length > 0) {
            let parsedEnvVars;
            try {
                parsedEnvVars = JSON.parse(envVars);
                const envVarNames: string[] = [];
                for (let key in parsedEnvVars) {
                    envVarNames.push(key);
                }
                envVars = envVarNames.join(", ");
            } catch (e) {
                console.log(e);
            }
        }

        tableValues.push([
                             lambda.name,
                             lambda.arch.join(", "),
                             lambda.runtime,
                             `${lambda.timeout}`,
                             `${lambda.memorySize}`,
                             `${lambda.tmpFolderMemory}`,
                             lambda.tracing,
                             envVars,
                         ]);
    });

    const header = makeHeader("AWS Lambda Information", MdHeader.HEADER_LEVEL_2);
    const table = createMdTable(HEADER_LINE, tableValues);
    return `${header}\n${table}`;
};