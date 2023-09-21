import { ResourcesMappedById, ResourcesMappedByType } from "../../aws/parser";
import { EventsEventBus, EventsRule }                 from "../models";
import { AWS_Events_EventBus, AWS_Events_Rule }       from "../../aws/constants";
import { AwsEventsEventBus, AwsEventsRule }           from "../../aws/models/events/eventbus";
import { fnGetAtt }                                   from "../common_utils";
import { Resource }                                   from "../../aws/models/common";

export function getMappedEventsEventBus(resources: [ResourcesMappedByType, ResourcesMappedById]): EventsEventBus[] {
    const resourcesByType = resources[0];
    const result: EventsEventBus[] = [];
    const eventBuses = resourcesByType[AWS_Events_EventBus];
    if (eventBuses === undefined || eventBuses.length === 0) {
        return [];
    }

    eventBuses
        .map(eventBusResource => {
            return eventBusResource as AwsEventsEventBus;
        })
        .map(eventBus => {
            const res: EventsEventBus = {name: eventBus.Properties.Name, type: eventBus.Type};
            return res;
        })
        .forEach(eventBus => {
            result.push(eventBus);
        });

    return result;
}

export function getMappedEventsRule(resources: [ResourcesMappedByType, ResourcesMappedById]): EventsRule[] {
    const resourcesByType = resources[0];
    const resourcesById = resources[1];
    const result: EventsRule[] = [];
    const rules = resourcesByType[AWS_Events_Rule];
    if (rules === undefined || rules.length === 0) {
        return [];
    }

    rules
        .map(eventBusResource => {
            return eventBusResource as AwsEventsRule;
        })
        .map(rule => {
            const eventBusId = rule.Properties.EventBusName !== undefined && rule.Properties.EventBusName.Ref != undefined ?
                               rule.Properties.EventBusName.Ref :
                               undefined;
            const eventBusResource = eventBusId !== undefined ?
                                     resourcesById[eventBusId] as AwsEventsEventBus :
                                     undefined;
            const eventBusName = eventBusResource !== undefined ? eventBusResource.Properties.Name : "";

            const targets = rule.Properties.Targets
                                .map(target => {
                                    let resource: Resource | undefined;
                                    let arnOfTarget;
                                    if (typeof target.Arn === "string") {
                                        if (target.Arn.length > 0) {
                                            const splitRes = target.Arn.split(":");
                                            arnOfTarget = splitRes.reverse()[0];
                                        }
                                    } else if (target.Arn.Ref !== undefined && target.Arn.Ref.length > 0) {
                                        resource = resourcesById[target.Arn.Ref];
                                    } else if (target.Arn["Fn::GetAtt"] !== undefined && target.Arn["Fn::GetAtt"].length > 0) {
                                        resource = fnGetAtt(target.Arn, resourcesById);
                                    }
                                    const name = arnOfTarget !== undefined ?
                                                 arnOfTarget :
                                                 resource !== undefined ? resource.Name : "";
                                    const type = resource !== undefined ? resource.Type : "";
                                    const dlqResource = fnGetAtt(target.DeadLetterConfig?.Arn, resourcesById);
                                    const dlqName = dlqResource !== undefined ? dlqResource.Name : "";
                                    const sqsParams = JSON.stringify(target.SqsParameters);

                                    return {
                                        type: type,
                                        name: name,
                                        dlq: dlqName,
                                        sqsParams: sqsParams,
                                    };
                                });

            const res: EventsRule = {
                type: rule.Type,
                name: rule.Properties.Name,
                parentEventBus: eventBusName,
                state: rule.Properties.State,
                pattern: JSON.stringify(rule.Properties.EventPattern),
                targets: targets,
            };
            return res;
        })
        .forEach(eventBus => {
            result.push(eventBus);
        });

    return result;
}
