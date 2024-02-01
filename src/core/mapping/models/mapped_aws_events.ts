import { CommonMappedResource } from "./mapped_common";


export interface MappedEventsEventBus extends CommonMappedResource {
}

export interface AwsEventsRuleTarget {
    type: string;
    name: string;
    dlq: string;
    sqsParams: string;
}

export interface MappedEventsRule extends CommonMappedResource {
    parentEventBus: string; // AwsEventsRule.EventBusName.Ref
    state: string;// AwsEventsRule.Sate
    pattern: string; // AwsEventsRule.EventPattern
    scheduleExpression: string; // AwsEventsRule.ScheduleExpression
    targets: AwsEventsRuleTarget[];
}