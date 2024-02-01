import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import { getFixedName }                                         from "../utils/utils";
import { MappedLambdaFunction }                                 from "../models/mapped_aws_lambda";
import { AWS_LAMBDA_FUNCTION }                                  from "../../cloudformation/constants";
import { AwsLambdaFunction }                                    from "../../cloudformation/models/aws_lambda";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize
const LAMBDA_MEMORY_SIZE_DEFAULT: number = 128;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-architectures
const LAMBDA_ARCH_DEFAULT: string = "x86_64";
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-ephemeralstorage
const LAMBDA_EPHEMERAL_STORAGE_DEFAULT: number = 512;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout
const LAMBDA_TIMEOUT_DEFAULT: number = 3;

export class MapperMappedLambdaFunction implements Mapper<MappedLambdaFunction> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedLambdaFunction {
        basicResourceValidation(resource, AWS_LAMBDA_FUNCTION);

        const lambdaResource: AwsLambdaFunction = resource as AwsLambdaFunction;
        const lambdaId: string = lambdaResource._ID;
        const lambdaType: string = lambdaResource.Type;
        const lambdaName: string = getFixedName(lambdaResource._Name, options);
        const lambdaRuntime: string = lambdaResource.Properties.Runtime;
        const lambdaMemorySize: number = lambdaResource?.Properties?.MemorySize ?? LAMBDA_MEMORY_SIZE_DEFAULT;
        const lambdaTracingMode: string = lambdaResource?.Properties?.TracingConfig?.Mode ?? "";
        const lambdaTmpFolderMemory: number = lambdaResource?.Properties?.EphemeralStorage?.Size ?? LAMBDA_EPHEMERAL_STORAGE_DEFAULT;

        const envVarsNode = lambdaResource?.Properties?.Environment?.Variables ?? {};
        const lambdaEnvironmentVars: string = JSON.stringify(envVarsNode);

        const archArray = lambdaResource?.Properties?.Architectures ?? [];
        const lambdaArchitecture: string[] = archArray.length > 0 ? archArray : [LAMBDA_ARCH_DEFAULT];

        const timeout = lambdaResource?.Properties?.Timeout ?? 0;
        const lambdaTimeout: number = timeout > 0 ? timeout : LAMBDA_TIMEOUT_DEFAULT;

        return {
            id: lambdaId,
            type: lambdaType,
            name: lambdaName,
            arch: lambdaArchitecture,
            runtime: lambdaRuntime,
            timeout: lambdaTimeout,
            envVars: lambdaEnvironmentVars,
            tracing: lambdaTracingMode,
            memorySize: lambdaMemorySize,
            tmpFolderMemory: lambdaTmpFolderMemory,
        };
    }
}