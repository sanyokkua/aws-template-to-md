import { CommonResource } from "./common_models";

export type DynamoDbKeySchemaItem = {
    AttributeName: string,
    KeyType: string
}

export type DynamoDbAttributeDefinitionsItem = {
    AttributeName: string,
    AttributeType: string
}

export type GlobalSecondaryIndex = {
    IndexName: string,
    KeySchema: DynamoDbKeySchemaItem[]
}

export type LocalSecondaryIndex = {
    IndexName: string,
    KeySchema: DynamoDbKeySchemaItem[],
}

export type DynamoDbProperties = {
    KeySchema: DynamoDbKeySchemaItem[];
    AttributeDefinitions: DynamoDbAttributeDefinitionsItem[];
    GlobalSecondaryIndexes: GlobalSecondaryIndex[];
    LocalSecondaryIndexes: LocalSecondaryIndex[];
    BillingMode: string;
    TableName: string;
}

// "AWS::DynamoDB::Table", also partially compatible with AWS::DynamoDB::GlobalTable
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
export interface AwsDynamoDbTable extends CommonResource {
    "Properties": DynamoDbProperties;
}