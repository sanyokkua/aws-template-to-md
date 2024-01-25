import { CommonMappedResource } from "./mapped_common";

export interface MappedLambdaFunction extends CommonMappedResource {
    arch: string[]; // AwsLambdaFunction.Properties.Architectures
    runtime: string; // AwsLambdaFunction.Properties.Runtime
    timeout: number; // AwsLambdaFunction.Properties.Timeout
    envVars: string; // AwsLambdaFunction.Properties.Environment.Variables
    tracing: string; // AwsLambdaFunction.Properties.TracingConfig.Mode
    memorySize: number; // AwsLambdaFunction.Properties.MemorySize
    tmpFolderMemory: number; // AwsLambdaFunction.Properties.EphemeralStorage.Size
}