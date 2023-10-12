import { ResourcesMappedById, ResourcesMappedByType } from "../../../aws/parser";
import {
    DynamoDbField,
    DynamoDbTable,
}                                                     from "../models/models";
import {
    AWS_DynamoDB_Table,
}                                                     from "../../../aws/constants";
import {
    AwsDynamoDbTable,
    DynamoDbAttributeDefinitionsItem,
    DynamoDbKeySchemaItem,
    GlobalSecondaryIndex,
}                                                     from "../../../aws/models/dynamodb/dynamodb";


const AttributeType: { [key: string]: string } = {
    "S": "String",
    "N": "Number",
    "B": "Binary",
};


// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html
const DbKeyRole: { [key: string]: string } = {
    "HASH": "Partition Key",
    "RANGE": "Sort Key",
};

type DynamoDbKey = {
    keyName: string;
    keyType: string;
    globalIndexes: Set<string>;
    localIndexes: Set<string>;
    keyRole: string;
}

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
export function getMappedDynamoDbTable(resources: [ResourcesMappedByType, ResourcesMappedById]): DynamoDbTable[] {
    const resourcesByType = resources[0];
    const result: DynamoDbTable[] = [];
    const dynamoDbs = resourcesByType[AWS_DynamoDB_Table];

    if (dynamoDbs === undefined || dynamoDbs.length === 0) {
        return result;
    }

    return dynamoDbs
        .map(resource => resource as AwsDynamoDbTable)
        .map(dynamoDbTable => {
            // A list of attributes that describe the key schema for the table and indexes.
            // Represent all available attributes in DB
            let attributeDefItems: DynamoDbAttributeDefinitionsItem[] = dynamoDbTable.Properties?.AttributeDefinitions || [];
            attributeDefItems = attributeDefItems.map(attr => {
                return {
                    AttributeName: attr.AttributeName,
                    AttributeType: AttributeType[attr.AttributeType],
                };
            });
            // Specifies the attributes that make up the primary key for the table.
            // The attributes in the KeySchema property must also be defined in the AttributeDefinitions property.
            // KeySchema: The primary key of the table.
            const keySchemaItems: DynamoDbKeySchemaItem[] = dynamoDbTable.Properties?.KeySchema || [];
            // Contains a list of created global index with their keys definitions
            const globalIndexes: GlobalSecondaryIndex[] = dynamoDbTable.Properties?.GlobalSecondaryIndexes || [];
            // Contains a list of created local index with their keys definitions
            const localIndexes: GlobalSecondaryIndex[] = dynamoDbTable.Properties?.LocalSecondaryIndexes || [];

            const attributeKeysMap: Map<string, DynamoDbKey> = new Map<string, DynamoDbKey>();

            keySchemaItems.forEach(key => {
                attributeKeysMap.set(key.AttributeName, {
                    localIndexes: new Set<string>(),
                    globalIndexes: new Set<string>(),
                    keyName: key.AttributeName,
                    keyType: key.KeyType,
                    keyRole: DbKeyRole[key.KeyType],
                });
            });
            globalIndexes.forEach(index => {
                index.KeySchema.forEach(key => {
                    const attFromMap = attributeKeysMap.get(key.AttributeName);
                    if (attFromMap !== undefined) {
                        attFromMap.globalIndexes.add(index.IndexName);
                    } else {
                        const localIndexes = new Set<string>();
                        const globalIndexes = new Set<string>();
                        globalIndexes.add(index.IndexName);

                        attributeKeysMap.set(key.AttributeName, {
                            globalIndexes: globalIndexes,
                            localIndexes: localIndexes,
                            keyName: key.AttributeName,
                            keyType: key.KeyType,
                            keyRole: DbKeyRole[key.KeyType],
                        });
                    }
                });
            });
            localIndexes.forEach(index => {
                index.KeySchema.forEach(key => {
                    const attFromMap = attributeKeysMap.get(key.AttributeName);
                    if (attFromMap !== undefined) {
                        attFromMap.localIndexes.add(index.IndexName);
                    } else {
                        const localIndexes = new Set<string>();
                        const globalIndexes = new Set<string>();
                        localIndexes.add(index.IndexName);

                        attributeKeysMap.set(key.AttributeName, {
                            localIndexes: localIndexes,
                            globalIndexes: globalIndexes,
                            keyName: key.AttributeName,
                            keyType: key.KeyType,
                            keyRole: DbKeyRole[key.KeyType],
                        });
                    }
                });
            });

            const fields: DynamoDbField[] = attributeDefItems.map(attr => {
                const attrName = attr.AttributeName;
                const attrType = attr.AttributeType;

                const foundKey = attributeKeysMap.get(attrName);
                const keyType = foundKey !== undefined ? foundKey.keyType : "";
                const keyRole = foundKey !== undefined ? foundKey.keyRole : "";
                const locIndex = foundKey !== undefined ? foundKey.localIndexes : new Set<string>();
                const globIndex = foundKey !== undefined ? foundKey.globalIndexes : new Set<string>();

                const localIndexValues: string[] = [];
                const globalIndexValues: string[] = [];

                locIndex.forEach(value => localIndexValues.push(value));
                globIndex.forEach(value => globalIndexValues.push(value));

                return {
                    name: attrName,
                    type: attrType,
                    keyType: keyType,
                    keyRole: keyRole,
                    localIndexes: localIndexValues,
                    globalIndexes: globalIndexValues,
                };
            });

            return {
                id: dynamoDbTable.ID,
                type: dynamoDbTable.Type,
                name: dynamoDbTable.Name,
                structure: {
                    fields: fields,
                },
                updateReplacePolicy: dynamoDbTable.UpdateReplacePolicy,
                deletionPolicy: dynamoDbTable.DeletionPolicy,
            };
        });
}
