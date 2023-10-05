import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { DynamoDbTable }                              from "../models/models";
import { AWS_DynamoDB_Table }                         from "../../aws/constants";
import { AwsDynamoDbTable }                           from "../../aws/models/dynamodb/dynamodb";


const AttributeType: { [key: string]: string } = {
    "S": "String",
    "N": "Number",
    "B": "Binary",
};


export function getMappedDynamoDbTable(resources: [ResourcesMappedByType, ResourcesMappedById]): DynamoDbTable[] {
    const resourcesByType = resources[0];
    const result: DynamoDbTable[] = [];
    const dynamoDbs = resourcesByType[AWS_DynamoDB_Table];

    if (dynamoDbs === undefined || dynamoDbs.length === 0) {
        return result;
    }

    return dynamoDbs
        .map(resource => resource as AwsDynamoDbTable)
        .map(dynamoDb => {
            const dynamoDbKeys = dynamoDb.Properties.KeySchema
                                         .map(keyItem => {
                                             return {
                                                 name: keyItem.AttributeName,
                                                 type: keyItem.KeyType,
                                             };
                                         });
            const dynamoDbAttributes = dynamoDb.Properties.AttributeDefinitions
                                               .map(attr => {
                                                   return {
                                                       name: attr.AttributeName,
                                                       type: AttributeType[attr.AttributeType],
                                                   };
                                               });
            return {
                id: dynamoDb.ID,
                type: dynamoDb.Type,
                name: dynamoDb.Name,
                structure: {
                    keys: dynamoDbKeys,
                    attributes: dynamoDbAttributes,
                },
                updateReplacePolicy: dynamoDb.UpdateReplacePolicy,
                deletionPolicy: dynamoDb.DeletionPolicy,
            };
        });
}
