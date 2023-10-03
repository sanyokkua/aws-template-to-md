import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { LambdaFunction }                             from "../models";
import { AWS_Lambda_Function }                        from "../../aws/constants";
import { AwsLambdaFunction }                          from "../../aws/models/lambda/lambda";


// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize
const LAMBDA_MEMORY_SIZE_DEFAULT: number = 128;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-architectures
const LAMBDA_ARCH_DEFAULT: string = "x86_64";
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-ephemeralstorage
const LAMBDA_Ephemeral_Storage_DEFAULT: number = 512;
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout
const LAMBDA_Timeout_DEFAULT: number = 3;

export function getMappedLambdaFunction(resources: [ResourcesMappedByType, ResourcesMappedById]): LambdaFunction[] {
    const resourcesByType = resources[0];
    const result: LambdaFunction[] = [];
    const lambdaResources = resourcesByType[AWS_Lambda_Function];

    if (lambdaResources === undefined || lambdaResources.length === 0) {
        return result;
    }

    return lambdaResources
        .map(resource => resource as AwsLambdaFunction)
        .map(lambda => {
            const functionName = lambda.Name !== undefined && lambda.Name.length > 0
                                 ? lambda.Name : lambda.ID;
            const memorySize: number =
                lambda.Properties.MemorySize !== undefined &&
                lambda.Properties.MemorySize !== null &&
                lambda.Properties.MemorySize >= LAMBDA_MEMORY_SIZE_DEFAULT
                ? lambda.Properties.MemorySize : LAMBDA_MEMORY_SIZE_DEFAULT;
            const envVars = lambda.Properties.Environment !== undefined && lambda.Properties.Environment.Variables != undefined
                            ? JSON.stringify(lambda.Properties.Environment.Variables) : ";";
            const tracing = lambda.Properties.TracingConfig !== undefined && lambda.Properties.TracingConfig.Mode !== undefined
                            ? lambda.Properties.TracingConfig.Mode : "";
            const arch = lambda.Properties.Architectures !== undefined && lambda.Properties.Architectures.length > 0
                         ? lambda.Properties.Architectures : [LAMBDA_ARCH_DEFAULT];
            const timeout = lambda.Properties.Timeout !== undefined && lambda.Properties.Timeout > 0
                            ? lambda.Properties.Timeout : LAMBDA_Timeout_DEFAULT;

            const tmpFolderMemory = lambda.Properties.EphemeralStorage !== undefined && lambda.Properties.EphemeralStorage.Size !== undefined
                                    ? lambda.Properties.EphemeralStorage.Size : LAMBDA_Ephemeral_Storage_DEFAULT;
            return {
                type: lambda.Type,
                name: functionName,
                arch: arch,
                runtime: lambda.Properties.Runtime,
                timeout: timeout,
                envVars: envVars,
                tracing: tracing,
                memorySize: memorySize,
                tmpFolderMemory: tmpFolderMemory,
            };
        });
}
