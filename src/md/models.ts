export type ApiGatewayRestApi = {
    type: string;  // AwsApiGatewayRestApi.Type
    name: string;  // AwsApiGatewayRestApi.Name
    environment: string; // AwsApiGatewayStage.Properties.StageName
    tracingEnabled: boolean; // AwsApiGatewayStage.Properties.TracingEnabled
    methodSettings: {
        dataTraceEnabled: boolean,    // AwsApiGatewayStage.Properties.MethodSettings.DataTraceEnabled
        httpMethod: string,   // AwsApiGatewayStage.Properties.MethodSettings.HttpMethod
        loggingLevel: string, // AwsApiGatewayStage.Properties.MethodSettings.LoggingLevel
        metricsEnabled: boolean,  // AwsApiGatewayStage.Properties.MethodSettings.MetricsEnabled
        resourcePath: string  // AwsApiGatewayStage.Properties.MethodSettings.ResourcePath
    }[]
    endpoints: {
        url: string; // Build based on the AwsApiGatewayResource.Properties.PathPart
        method: string; // AwsApiGatewayMethod.Properties.HttpMethod
        integrationType: string; // AwsApiGatewayMethod.Properties.Integration.Type
        destination: string; // Should be built by joining of AwsApiGatewayMethod.Properties.Integration.Uri
        modelSchema: string; // AwsApiGatewayMethod.Properties.* There is a ref to AwsApiGatewayModel.Properties.Schema
    }[];
    authorizer: {
        type: string; // AwsApiGatewayAuthorizer.Properties.Type
    };
}
export type EventsEventBus = {
    type: string;  // AwsEventsEventBus.Type
    name: string;  // AwsEventsEventBus.Properties.Name
}
export type EventsRule = {
    type: string;  // AwsEventsRule.Type
    name: string; // AwsEventsRule.Name
    parentEventBus: string; // AwsEventsRule.EventBusName.Ref
    state: string;// AwsEventsRule.Sate
    pattern: string; // AwsEventsRule.EventPattern
    targets: {
        type: string;
        name: string;
        dlq: string;
        sqsParams: string;
    }[]
}
export type DynamoDbTable = {
    type: string;  // AwsDynamoDbTable.Type
    name: string;  // AwsDynamoDbTable.Properties.TableName
    structure: {
        keys: {
            name: string; // AwsDynamoDbTable.Properties.KeySchema.AttributeName
            type: string; // AwsDynamoDbTable.Properties.KeySchema.KeyType
        }[],
        attributes: {
            name: string; // AwsDynamoDbTable.Properties.AttributeDefinitions.AttributeName
            type: string; // AwsDynamoDbTable.Properties.AttributeDefinitions.AttributeType
        }[]
    },
    updateReplacePolicy: string; // AwsDynamoDbTable.UpdateReplacePolicy
    deletionPolicy: string; // AwsDynamoDbTable.DeletionPolicy
}
export type StepFunctionsStateMachine = {
    type: string;  // AwsStepFunctionsStateMachine.Type
    name: string;  // AwsStepFunctionsStateMachine.Properties.StateMachineName
    definition: string; // AwsStepFunctionsStateMachine.Properties.DefinitionString
    updateReplacePolicy: string; // AwsStepFunctionsStateMachine.UpdateReplacePolicy
    deletionPolicy: string; // AwsStepFunctionsStateMachine.DeletionPolicy
}
export type LambdaFunction = {
    type: string;  // AwsLambdaFunction.Type
    name: string;  // AwsLambdaFunction.Properties.FunctionName
    arch: string[]; // AwsLambdaFunction.Properties.Architectures
    runtime: string; // AwsLambdaFunction.Properties.Runtime
    timeout: number; // AwsLambdaFunction.Properties.Timeout
    envVars: string; // AwsLambdaFunction.Properties.Environment.Variables
    tracing: string; // AwsLambdaFunction.Properties.TracingConfig.Mode
    memorySize: number; // AwsLambdaFunction.Properties.MemorySize
    tmpFolderMemory: number; // AwsLambdaFunction.Properties.EphemeralStorage.Size
}
export type S3Bucket = {
    type: string;  // AwsS3Bucket.Type
    name: string;  // AwsS3Bucket.Properties.BucketName
    updateReplacePolicy: string; // AwsDynamoDbTable.UpdateReplacePolicy
    deletionPolicy: string; // AwsDynamoDbTable.DeletionPolicy
}
export type SNSTopic = {
    type: string;  // AwsSNSTopic.Type
    name: string;  // AwsSNSTopic.Properties.TopicName
    subscriptions: {
        protocol: string;// AwsSNSSubscription.Properties.Protocol
        endpoint: string;// AwsSNSSubscription.Properties.Endpoint
    }[]
}
export type SQSQueue = {
    type: string;  // AwsSQSQueue.Type
    name: string;  // AwsSQSQueue.Properties.QueueName
    contentBasedDeduplication: boolean; // AwsSQSQueue.Properties.ContentBasedDeduplication
    fifoQueue: boolean; // AwsSQSQueue.Properties.FifoQueue
    delaySeconds: number; // AwsSQSQueue.Properties.DelaySeconds
    messageRetentionPeriod: number; // AwsSQSQueue.Properties.MessageRetentionPeriod
    visibilityTimeout: number; // AwsSQSQueue.Properties.VisibilityTimeout
    updateReplacePolicy: string; // AwsSQSQueue.UpdateReplacePolicy
    deletionPolicy: string; // AwsSQSQueue.DeletionPolicy
}

export type DocumentResourcesTree = {
    mappedApiGatewayRestApi: ApiGatewayRestApi[];
    mappedEventsEventBus: EventsEventBus[];
    mappedEventsRule: EventsRule[];
    mappedDynamoDbTable: DynamoDbTable[];
    mappedStepFunctionsStateMachine: StepFunctionsStateMachine[];
    mappedLambdaFunction: LambdaFunction[];
    mappedS3Bucket: S3Bucket[];
    mappedSNSTopic: SNSTopic[];
    mappedSQSQueue: SQSQueue[];
}