import { CommonMappedResource } from "./mapped_common";

export interface DynamoDbField {
    name: string;
    type: string;
    keyType: string;
    globalIndexes: string[];
    localIndexes: string[];
    keyRole: string;
}

export interface MappedDynamoDbTable extends CommonMappedResource {
    fields: DynamoDbField[];
}