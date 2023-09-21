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

export type DynamoDbProperties = {
    KeySchema: DynamoDbKeySchemaItem[],
    AttributeDefinitions: DynamoDbAttributeDefinitionsItem[],
    BillingMode: string,
    TableName: string
}

export interface AwsDynamoDbTable extends CommonResourceInfo {
    "Properties": DynamoDbProperties,
    "UpdateReplacePolicy": string,
    "DeletionPolicy": string,
}