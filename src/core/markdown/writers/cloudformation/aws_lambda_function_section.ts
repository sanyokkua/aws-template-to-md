import { AdditionalConfigs, MarkdownWriterFunc } from "../common";
import { DocumentResourcesTree }                 from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                          from "../../../common_utils";
import { DEFAULT_OTHER_APP_CONFIGURATION }       from "../../../config/constatns";
import { MappedLambdaFunction }                  from "../../../mapping/models/mapped_aws_lambda";
import { mdMakeContentBlock, mdMakeTable }       from "../../utils";
import { isEmptyString }                         from "../../../string_utils";
import logger                                    from "../../../../logger";

export const SHOW_LAMBDA_VARS = "showLambdaVars";
export const SHOW_LAMBDA_VARS_VALUES = "showLambdaVarsValues";

type Configuration = {
    showLambdaVars: boolean;
    showLambdaVarsValues: boolean;
}

export const createAwsLambdaFunctionsSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsLambdaFunctionsSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const mappedLambdaFunctions = dataValue.getMappedLambdaFunction();
    if (isEmptyArray(mappedLambdaFunctions)) {
        logger.debug({},
                     "createAwsLambdaFunctionsSectionText. mappedLambdaFunctions is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsLambdaFunctionsSectionText. input values");

    let showLambdaVars: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showLambdaVars;
    let showLambdaVarsValues: boolean = DEFAULT_OTHER_APP_CONFIGURATION.showLambdaVarsValues;

    if (additionalConfigs !== undefined) {
        showLambdaVars = additionalConfigs[SHOW_LAMBDA_VARS] ?? showLambdaVars;
        showLambdaVarsValues = additionalConfigs[SHOW_LAMBDA_VARS_VALUES] ?? showLambdaVarsValues;
    }

    const configuration: Configuration = {
        showLambdaVars,
        showLambdaVarsValues,
    };

    return createMarkdownContent(mappedLambdaFunctions, configuration);
};

function createMarkdownContent(mappedLambdaFunctions: MappedLambdaFunction[], configuration: Configuration): string {
    const content: string = createLambdasTable(mappedLambdaFunctions, configuration);

    return mdMakeContentBlock(content, "AWS Lambda Information");
}

function createLambdasTable(lambdaFunctions: MappedLambdaFunction[], configuration: Configuration): string {
    const lambdaTableHeader: string[] = [
        "Name",
        "Arch",
        "Runtime",
        "Timeout (Sec)",
        "RAM (Mb)",
        "/tmp Size (Mb)",
        "Tracing",
    ];
    if (configuration.showLambdaVars) {
        lambdaTableHeader.push("Env Vars");
    }

    const tableValues: string[][] = [];

    for (const lambda of lambdaFunctions) {
        const envVarsJsonString: string = getEnvVarsAsCommaSeparatedListString(lambda,
                                                                               configuration.showLambdaVarsValues);

        const lambdaRowValues: string[] = [];

        lambdaRowValues.push(lambda.name);
        lambdaRowValues.push(lambda.arch.join(", "));
        lambdaRowValues.push(lambda.runtime);
        lambdaRowValues.push(`${lambda.timeout}`);
        lambdaRowValues.push(`${lambda.memorySize}`);
        lambdaRowValues.push(`${lambda.tmpFolderMemory}`);
        lambdaRowValues.push(lambda.tracing);

        if (configuration.showLambdaVars) {
            lambdaRowValues.push(envVarsJsonString);
        }

        tableValues.push(lambdaRowValues);
    }

    return mdMakeTable(lambdaTableHeader, tableValues);
}

function getEnvVarsAsCommaSeparatedListString(lambda: MappedLambdaFunction, enableEnvVarValues: boolean): string {
    if (isEmptyString(lambda.envVars)) {
        return "";
    }

    let envVarsJsonString;
    try {
        const parsedEnvVars = JSON.parse(lambda.envVars);
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
        envVarsJsonString = lambda.envVars;
    }

    return envVarsJsonString;
}