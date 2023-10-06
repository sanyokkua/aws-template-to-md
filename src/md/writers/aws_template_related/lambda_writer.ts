import {
    createContentBlock,
    createMdTable,
    MdHeader,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                                from "../common/common_md_functions";
import { DocumentResourcesTree, LambdaFunction } from "../../models/models";

function getEnvVarsAsCommaSeparatedListString(lambda: LambdaFunction, enableEnvVarValues: boolean): string {
    let envVarsJsonString: string = lambda.envVars;

    if (envVarsJsonString !== undefined && envVarsJsonString.length > 0) {
        let parsedEnvVars;
        try {
            parsedEnvVars = JSON.parse(envVarsJsonString);
            const envVarNames: string[] = [];

            for (let key in parsedEnvVars) {
                if (enableEnvVarValues) {
                    const val = parsedEnvVars[key];
                    envVarNames.push(`${key}=${val}`);
                } else {
                    envVarNames.push(key);
                }
            }

            envVarsJsonString = envVarNames.sort().join(", ");
        } catch (e) {
            console.log(e);
            envVarsJsonString = lambda.envVars;
        }
    }

    return envVarsJsonString;
}

function createLambdaContent(lambdaFunctions: LambdaFunction[], enableEnvVarValues: boolean): string {
    const HEADER_LINE: string[] = [
        "Name",
        "Arch",
        "Runtime",
        "Timeout (Sec)",
        "RAM (Mb)",
        "/tmp Size (Mb)",
        "Tracing",
        "Env Vars",
    ];
    const tableValues: string[][] = [];

    lambdaFunctions.forEach(lambda => {
        const envVarsJsonString: string = getEnvVarsAsCommaSeparatedListString(lambda, enableEnvVarValues);
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

export const writeLambdaFunctions: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const lambdaFunctions = params.value.mappedLambdaFunction;
    if (lambdaFunctions === undefined || lambdaFunctions.length === 0) {
        return "";
    }
    let enableEnvVarValues: boolean = false;
    if (options !== undefined) {
        enableEnvVarValues = options["enableEnvVarValues"] ? options["enableEnvVarValues"] : false;
    }

    const content: string = createLambdaContent(lambdaFunctions, enableEnvVarValues);
    return createContentBlock("AWS Lambda Information", MdHeader.HEADER_LEVEL_2, content);
};