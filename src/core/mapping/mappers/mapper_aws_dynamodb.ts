import { basicResourceValidation, Mapper }                      from "./mapper";
import { CommonResource, RawCloudFormationResourcesCollection } from "../../cloudformation/models/common_models";
import { ParsingOptions }                                       from "../options/parsing_options";
import { DynamoDbField, MappedDynamoDbTable }                   from "../models/mapped_aws_dynamodb";
import { getFixedName }                                         from "../utils/utils";
import { AWS_DYNAMO_DB_TABLE }                                  from "../../cloudformation/constants";
import {
    AwsDynamoDbTable,
    DynamoDbAttributeDefinitionsItem,
    DynamoDbKeySchemaItem,
    GlobalSecondaryIndex,
    LocalSecondaryIndex,
}                                                               from "../../cloudformation/models/aws_dynamodb";

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-attributedefinition.html#cfn-dynamodb-table-attributedefinition-attributetype
const ATTRIBUTE_TYPE_MAP: { [key: string]: string } = {
    "S": "String",
    "N": "Number",
    "B": "Binary",
};


// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-keyschema.html#cfn-dynamodb-table-keyschema-keytype
const DB_KEY_ROLE_MAP: { [key: string]: string } = {
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

export class MapperDynamoDbTable implements Mapper<MappedDynamoDbTable> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedDynamoDbTable {
        basicResourceValidation(resource, AWS_DYNAMO_DB_TABLE);

        const dynamoDbResource: AwsDynamoDbTable = resource as AwsDynamoDbTable;
        const dynamoDbId: string = dynamoDbResource._ID;
        const dynamoDbType: string = dynamoDbResource.Type;
        const dynamoDbName: string = getFixedName(dynamoDbResource._Name, options);
        const dynamoDbFields: DynamoDbField[] = this.getDynamoDbFields(dynamoDbResource);

        return {
            id: dynamoDbId,
            type: dynamoDbType,
            name: dynamoDbName,
            fields: dynamoDbFields,
        };
    }

    private getDynamoDbFields(dynamoDbResource: AwsDynamoDbTable): DynamoDbField[] {
        // Specifies the attributes that make up the primary key for the table.
        // The attributes in the KeySchema property must also be defined in the AttributeDefinitions property.
        // KeySchema: The primary key of the table.
        const keySchemaItems: DynamoDbKeySchemaItem[] = dynamoDbResource.Properties?.KeySchema ?? [];
        // Contains a list of created global index with their keys definitions
        const globalIndexes: GlobalSecondaryIndex[] = dynamoDbResource.Properties?.GlobalSecondaryIndexes ?? [];
        // Contains a list of created local index with their keys definitions
        const localIndexes: LocalSecondaryIndex[] = dynamoDbResource.Properties?.LocalSecondaryIndexes ?? [];

        const attributeKeysMap: Map<string, DynamoDbKey> = new Map<string, DynamoDbKey>();

        keySchemaItems.forEach(key => {
            attributeKeysMap.set(key.AttributeName, {
                localIndexes: new Set<string>(),
                globalIndexes: new Set<string>(),
                keyName: key.AttributeName,
                keyType: key.KeyType,
                keyRole: DB_KEY_ROLE_MAP[key.KeyType],
            });
        });

        this.processIndexes(attributeKeysMap, globalIndexes, true);
        this.processIndexes(attributeKeysMap, localIndexes, false);

        // A list of attributes that describe the key schema for the table and indexes.
        // Represent all available attributes in DB
        const attributeDefItems: DynamoDbAttributeDefinitionsItem[] = dynamoDbResource?.Properties?.AttributeDefinitions.map(
            attr => {
                return {
                    AttributeName: attr.AttributeName,
                    AttributeType: ATTRIBUTE_TYPE_MAP[attr.AttributeType],
                };
            }) || [];


        return this.buildDynamoDbFields(attributeDefItems, attributeKeysMap);
    }

    private processIndexes(attributeKeysMap: Map<string, DynamoDbKey>, indexes: GlobalSecondaryIndex[] | LocalSecondaryIndex[], isGlobal: boolean) {
        for (const index of indexes) {
            for (const key of index.KeySchema) {
                const attFromMap = attributeKeysMap.get(key.AttributeName) || {
                    localIndexes: new Set<string>(),
                    globalIndexes: new Set<string>(),
                    keyName: key.AttributeName,
                    keyType: key.KeyType,
                    keyRole: DB_KEY_ROLE_MAP[key.KeyType],
                };

                if (isGlobal) {
                    attFromMap.globalIndexes.add(index.IndexName);
                } else {
                    attFromMap.localIndexes.add(index.IndexName);
                }

                attributeKeysMap.set(key.AttributeName, attFromMap);
            }
        }
    }

    private buildDynamoDbFields(attributeDefItems: DynamoDbAttributeDefinitionsItem[], attributeKeysMap: Map<string, DynamoDbKey>): DynamoDbField[] {
        return attributeDefItems.map(attr => {
            const attrName = attr.AttributeName;
            const attrType = attr.AttributeType;

            const foundKey = attributeKeysMap.get(attrName) || {} as DynamoDbKey;
            const keyType = foundKey.keyType || "";
            const keyRole = foundKey.keyRole || "";
            const locIndex = foundKey.localIndexes || new Set<string>();
            const globIndex = foundKey.globalIndexes || new Set<string>();

            return {
                name: attrName,
                type: attrType,
                keyType,
                keyRole,
                localIndexes: Array.from(locIndex),
                globalIndexes: Array.from(globIndex),
            };
        });
    }
}