import {
    CodeSyntax,
    createContentBlock,
    createMdCodeBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterFunc,
    WriterOptions,
    WriterParams,
}                                            from "../common/common_md_functions";
import { DocumentResourcesTree, EventsRule } from "../../models/models";


function createRuleDescriptionTable(eventsRule: EventsRule): string {
    const RULE_DESCRIPTION_HEADER: string[] = ["Name", "Parent Event Bus", "State"];
    const ruleDescriptionData: string[][] = [[eventsRule.name, eventsRule.parentEventBus, eventsRule.state]];

    return createMdTable(RULE_DESCRIPTION_HEADER, ruleDescriptionData);
}

function extractRulePatternAsCodeBlock(eventsRule: EventsRule): string {
    if (eventsRule.pattern === undefined || eventsRule.pattern.length === 0) {
        return "";
    }
    let pattern = "";

    try {
        const parsedPattern = JSON.parse(eventsRule.pattern);
        const stringify = JSON.stringify(parsedPattern, null, 2);
        pattern = createMdCodeBlock(stringify, CodeSyntax.JSON);
    } catch (e) {
        console.log(e);
        pattern = eventsRule.pattern;
    }

    return pattern;
}

function createRuleTargetsTable(eventsRule: EventsRule) {
    const RULE_TARGET_HEADER_LINE: string[] = ["Type", "Name", "DLQ", "SQS Params"];
    const ruleTargetTableValues: string[][] = [];

    eventsRule.targets.forEach(target => {
        ruleTargetTableValues.push([
                                       target.type !== undefined ? target.type : "",
                                       target.name !== undefined ? target.name : "",
                                       target.dlq !== undefined ? target.dlq : "",
                                       target.sqsParams !== undefined ? target.sqsParams : "",
                                   ]);
    });

    return createMdTable(RULE_TARGET_HEADER_LINE, ruleTargetTableValues);
}

function createRuleScheduledExpression(eventsRule: EventsRule) {
    if (eventsRule.scheduleExpression === undefined || eventsRule.scheduleExpression.length === 0) {
        return "";
    }
    return createMdCodeBlock(eventsRule.scheduleExpression, CodeSyntax.NONE);
}

function createRuleDescription(eventsRule: EventsRule) {
    const resultString: string[] = [];

    const ruleDescriptionTable: string = createRuleDescriptionTable(eventsRule);
    const rulePatternCodeBlock: string = extractRulePatternAsCodeBlock(eventsRule);
    const ruleTargetsTable: string = createRuleTargetsTable(eventsRule);
    const ruleScheduledExpression: string = createRuleScheduledExpression(eventsRule);

    resultString.push(ruleDescriptionTable);
    if (rulePatternCodeBlock.length > 0) {
        resultString.push(createContentBlock("Rule Pattern", MdHeader.HEADER_LEVEL_4, rulePatternCodeBlock));
    }
    if (ruleTargetsTable.length > 0) {
        resultString.push(createContentBlock("Rule Targets", MdHeader.HEADER_LEVEL_4, ruleTargetsTable));
    }
    if (ruleScheduledExpression.length > 0) {
        resultString.push(createContentBlock("Rule ScheduleExpression",
                                             MdHeader.HEADER_LEVEL_4,
                                             ruleScheduledExpression));
    }
    return resultString.join(NEW_LINE);
}

function createEventRulesContent(rules: EventsRule[]): string {
    const resultText: string[] = [];

    const header = ["Rule Name", "Rule State"];
    const data: string[][] = rules.map(rule => [rule.name, rule.state]);

    resultText.push(createContentBlock("Rules List", MdHeader.HEADER_LEVEL_3, createMdTable(header, data)));

    rules.forEach(rule => {
        const content = createRuleDescription(rule);
        resultText.push(createContentBlock(rule.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultText.join(NEW_LINE);
}

export const writeEventRules: WriterFunc<DocumentResourcesTree> = (params: WriterParams<DocumentResourcesTree>, options?: WriterOptions): string => {
    const rules = params.value.mappedEventsRule;
    if (rules === undefined || rules.length === 0) {
        return "";
    }

    const content: string = createEventRulesContent(rules);
    return createContentBlock("AWS Event Rule Information", MdHeader.HEADER_LEVEL_2, content);
};