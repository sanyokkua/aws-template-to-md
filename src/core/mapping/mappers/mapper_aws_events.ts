import { basicResourceValidation, Mapper }        from "./mapper";
import {
    CommonResource,
    RawCloudFormationResourcesCollection,
    StringType,
}                                                 from "../../cloudformation/models/common_models";
import { ParsingOptions }                         from "../options/parsing_options";
import { getFixedName, getStringValueForField }   from "../utils/utils";
import { MappedEventsEventBus, MappedEventsRule } from "../models/mapped_aws_events";
import { AWS_EVENTS_EVENT_BUS, AWS_EVENTS_RULE }  from "../../cloudformation/constants";
import {
    AwsEventsEventBus,
    AwsEventsRule,
}                                                 from "../../cloudformation/models/aws_events";
import { extractResourceName, isArn }             from "../../string_utils";


export class MapperMappedEventsEventBus implements Mapper<MappedEventsEventBus> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedEventsEventBus {
        basicResourceValidation(resource, AWS_EVENTS_EVENT_BUS);

        const eventBusResource: AwsEventsEventBus = resource as AwsEventsEventBus;
        const eventBusId: string = eventBusResource._ID;
        const eventBusType: string = eventBusResource.Type;
        const eventBusName: string = getFixedName(eventBusResource._Name, options);

        return {
            id: eventBusId,
            type: eventBusType,
            name: eventBusName,
        };
    }
}

export class MapperMappedEventsRule implements Mapper<MappedEventsRule> {
    mapResource(resource: CommonResource, rawResourcesCollection: RawCloudFormationResourcesCollection, options?: ParsingOptions): MappedEventsRule {
        basicResourceValidation(resource, AWS_EVENTS_RULE);

        const eventsRuleResource: AwsEventsRule = resource as AwsEventsRule;
        const eventsRuleId: string = eventsRuleResource._ID;
        const eventsRuleType: string = eventsRuleResource.Type;
        const eventsRuleName: string = getFixedName(eventsRuleResource._Name, options);
        const eventRulePattern = JSON.stringify(eventsRuleResource.Properties.EventPattern);
        const eventRuleScheduleExpression = eventsRuleResource.Properties.ScheduleExpression;
        const eventBusId: string = getStringValueForField(eventsRuleResource.Properties.EventBusName);
        const eventBusResource = rawResourcesCollection.getResourceById(eventBusId) as AwsEventsEventBus | undefined;
        const eventBusName: string = getFixedName(eventBusResource?._Name, options);
        const targets = this.getRuleTargets(eventsRuleResource, rawResourcesCollection, options);

        return {
            id: eventsRuleId,
            type: eventsRuleType,
            name: eventsRuleName,
            parentEventBus: eventBusName,
            state: eventsRuleResource.Properties.State,
            pattern: JSON.stringify(eventRulePattern),
            scheduleExpression: eventRuleScheduleExpression,
            targets: targets,
        };
    }

    private getRuleTargets(eventsRuleResource: AwsEventsRule, rawResourcesCollection: RawCloudFormationResourcesCollection, options: ParsingOptions | undefined) {
        return eventsRuleResource.Properties.Targets.map(target => {
            const targetResource = this.getResourceNameByArnField(target?.Arn, rawResourcesCollection, options);
            const targetDlqResource = this.getResourceNameByArnField(target?.DeadLetterConfig?.Arn,
                                                                     rawResourcesCollection,
                                                                     options);
            const sqsParams = JSON.stringify(target.SqsParameters);
            return {
                type: targetResource?.resource?.Type ?? "",
                name: targetResource.name,
                dlq: targetDlqResource.name,
                sqsParams: sqsParams,
            };
        });
    }

    private getResourceNameByArnField(resourceArn: StringType, rawResourcesCollection: RawCloudFormationResourcesCollection, options: ParsingOptions | undefined) {
        let resourceName: string;
        let resource: CommonResource | undefined;
        const targetArnValue = getStringValueForField(resourceArn);
        if (isArn(targetArnValue)) {
            const value = extractResourceName(targetArnValue) ?? "";
            resourceName = getFixedName(value, options);
        } else {
            resource = rawResourcesCollection.getResourceById(targetArnValue);
            resourceName = getFixedName(resource?._Name, options);
        }
        return {name: resourceName, resource: resource};
    }
}