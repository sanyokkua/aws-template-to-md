/*
AWS::DynamoDB::Table
* */

import { CommonResourceInfo } from "../common";

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

export interface AwsDynamoDbTable extends CommonResourceInfo {
    "Properties": DynamoDbProperties,
    "UpdateReplacePolicy": string,
    "DeletionPolicy": string,
}