import {
    AwsWriterFunction,
    CodeSyntax,
    createContentBlock,
    createMdCodeBlock,
    createMdTable,
    MdHeader,
    NEW_LINE,
    WriterOptions,
}                                            from "./common/common_md_functions";
import { DocumentResourcesTree, EventsRule } from "../models/models";


function createRuleDescriptionTable(eventsRule: EventsRule): string {
    const RULE_DESCRIPTION_HEADER: string[] = ["Name", "Parent Event Bus", "State"];
    const ruleDescriptionData: string[][] = [[eventsRule.name, eventsRule.parentEventBus, eventsRule.state]];

    return createMdTable(RULE_DESCRIPTION_HEADER, ruleDescriptionData);
}

function extractRulePatternAsCodeBlock(eventsRule: EventsRule): string {
    let pattern = eventsRule.pattern;

    if (pattern !== undefined && pattern.length > 0) {
        try {
            const parsedPattern = JSON.parse(pattern);
            const stringify = JSON.stringify(parsedPattern, null, 2);
            pattern = createMdCodeBlock(stringify, CodeSyntax.JSON);
        } catch (e) {
            console.log(e);
            pattern = eventsRule.pattern;
        }
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

function createRuleDescription(eventsRule: EventsRule) {
    const resultString: string[] = [];

    const ruleDescriptionTable: string = createRuleDescriptionTable(eventsRule);
    const rulePatternCodeBlock: string = extractRulePatternAsCodeBlock(eventsRule);
    const ruleTargetsTable: string = createRuleTargetsTable(eventsRule);

    resultString.push(ruleDescriptionTable);
    resultString.push(createContentBlock("Rule Pattern", MdHeader.HEADER_LEVEL_4, rulePatternCodeBlock));
    resultString.push(createContentBlock("Rule Targets", MdHeader.HEADER_LEVEL_4, ruleTargetsTable));

    return resultString.join(NEW_LINE);
}

function createEventRulesContent(rules: EventsRule[]): string {
    const resultText: string[] = [];

    rules.forEach(rule => {
        const content = createRuleDescription(rule);
        resultText.push(createContentBlock(rule.name, MdHeader.HEADER_LEVEL_3, content));
    });

    return resultText.join(NEW_LINE);
}

export const writeEventRules: AwsWriterFunction = (resourcesList: DocumentResourcesTree, options?: WriterOptions): string => {
    const rules = resourcesList.mappedEventsRule;
    if (rules === undefined || rules.length === 0) {
        return "";
    }

    const content: string = createEventRulesContent(rules);
    return createContentBlock("AWS Event Rule Information", MdHeader.HEADER_LEVEL_2, content);
};