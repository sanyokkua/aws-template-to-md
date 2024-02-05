import { AdditionalConfigs, MarkdownWriterFunc }            from "../common";
import { DocumentResourcesTree }                            from "../../../mapping/models/mapped_tree";
import { isEmptyArray }                                     from "../../../common_utils";
import { MappedEventsRule }                                 from "../../../mapping/models/mapped_aws_events";
import { mdMakeCodeBlock, mdMakeContentBlock, mdMakeTable } from "../../utils";
import { MDCodeSyntax, MDHeader, NEW_LINE }                 from "../../constants";
import { isEmptyString }                                    from "../../../string_utils";
import logger                                               from "../../../../logger";

export const createAwsEventsRulesSectionText: MarkdownWriterFunc<DocumentResourcesTree> = (dataValue: DocumentResourcesTree, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({}, "createAwsEventsRulesSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    const mappedEventsRules = dataValue.getMappedEventsRule();
    if (isEmptyArray(mappedEventsRules)) {
        logger.debug({},
                     "createAwsEventsRulesSectionText. mappedEventsRules is emptyArray, empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createAwsEventsRulesSectionText. input values");

    return createMarkdownContent(mappedEventsRules);
};

function createMarkdownContent(mappedEventsRules: MappedEventsRule[]): string {
    const resultText: string[] = [];
    const rulesListBlock = createRulesListBlock(mappedEventsRules);

    resultText.push(rulesListBlock);

    for (const rule of mappedEventsRules) {
        const ruleDescriptionBlock = createRuleDescriptionBlock(rule);
        resultText.push(ruleDescriptionBlock);
    }

    return mdMakeContentBlock(resultText.join(NEW_LINE), "AWS Event Rule Information");
}

function createRulesListBlock(mappedEventsRules: MappedEventsRule[]): string {
    const header = ["Rule Name", "Rule State"];
    const data: string[][] = mappedEventsRules.map(rule => [rule.name, rule.state]);
    const rulesTable = mdMakeTable(header, data);

    return mdMakeContentBlock(rulesTable, "Rules List", MDHeader.HEADER_LEVEL_3);
}

function createRuleDescriptionBlock(rule: MappedEventsRule): string {
    const ruleDescription = createRuleDescription(rule);

    return mdMakeContentBlock(ruleDescription, rule.name, MDHeader.HEADER_LEVEL_3);
}

function createRuleDescription(eventsRule: MappedEventsRule): string {
    const resultString: string[] = [];

    const ruleDescriptionTable: string = createRuleDescriptionTable(eventsRule);
    const rulePatternCodeBlock: string = extractRulePatternAsCodeBlock(eventsRule);
    const ruleTargetsTable: string = createRuleTargetsTable(eventsRule);
    const ruleScheduledExpression: string = createRuleScheduledExpression(eventsRule);

    let ruleDetailsBlock = "";
    let rulePatternBlock = "";
    let ruleTargetsBlock = "";
    let ruleScheduledExpBlock = "";

    if (!isEmptyString(ruleDescriptionTable)) {
        ruleDetailsBlock = mdMakeContentBlock(ruleDescriptionTable, "Rule Details", MDHeader.HEADER_LEVEL_4);
    }
    if (!isEmptyString(rulePatternCodeBlock)) {
        rulePatternBlock = mdMakeContentBlock(rulePatternCodeBlock, "Rule Pattern", MDHeader.HEADER_LEVEL_4);
    }
    if (!isEmptyString(ruleTargetsTable)) {
        ruleTargetsBlock = mdMakeContentBlock(ruleTargetsTable, "Rule Targets", MDHeader.HEADER_LEVEL_4);
    }
    if (!isEmptyString(ruleScheduledExpression)) {
        ruleScheduledExpBlock = mdMakeContentBlock(ruleScheduledExpression,
                                                   "Rule ScheduleExpression",
                                                   MDHeader.HEADER_LEVEL_4);
    }

    resultString.push(ruleDetailsBlock);
    resultString.push(rulePatternBlock);
    resultString.push(ruleTargetsBlock);
    resultString.push(ruleScheduledExpBlock);

    return resultString.filter(v => !isEmptyString(v)).join(NEW_LINE);
}

function createRuleDescriptionTable(eventsRule: MappedEventsRule): string {
    if (isEmptyArray(eventsRule?.targets)) {
        return "";
    }

    const ruleDescriptionHeader: string[] = ["Name", "Parent Event Bus", "State", "Target"];
    const ruleTargetNames: string[] = eventsRule?.targets.map(t => t.name);
    const ruleDescriptionData: string[][] = [
        [
            eventsRule.name,
            eventsRule.parentEventBus,
            eventsRule.state,
            ruleTargetNames.join(","),
        ],
    ];

    return mdMakeTable(ruleDescriptionHeader, ruleDescriptionData);
}

function extractRulePatternAsCodeBlock(eventsRule: MappedEventsRule): string {
    if (isEmptyString(eventsRule.pattern)) {
        return "";
    }

    try {
        let parsedPattern = JSON.parse(eventsRule.pattern);
        if (typeof parsedPattern === "string") { // In case if pattern was stringify 2 times
            parsedPattern = JSON.parse(parsedPattern);
        }
        const stringify = JSON.stringify(parsedPattern, null, 2);

        return mdMakeCodeBlock(stringify, MDCodeSyntax.JSON);
    } catch (e) {
        logger.warn(eventsRule.pattern, "extractRulePatternAsCodeBlock, result", e);
        return eventsRule.pattern;
    }
}

function createRuleTargetsTable(eventsRule: MappedEventsRule): string {
    const ruleTargetsHeader: string[] = ["Type", "Name", "DLQ", "SQS Params"];
    const ruleTargetTableValues: string[][] = [];

    for (const target of eventsRule.targets) {
        ruleTargetTableValues.push([
                                       target.type ?? "",
                                       target.name ?? "",
                                       target.dlq ?? "",
                                       target.sqsParams ?? "",
                                   ]);
    }

    return mdMakeTable(ruleTargetsHeader, ruleTargetTableValues);
}

function createRuleScheduledExpression(eventsRule: MappedEventsRule): string {
    if (isEmptyString(eventsRule.scheduleExpression)) {
        return "";
    }

    return mdMakeCodeBlock(eventsRule.scheduleExpression, MDCodeSyntax.NONE);
}
