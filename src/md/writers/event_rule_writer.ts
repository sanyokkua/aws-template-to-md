import { CodeSyntax, createMdCodeBlock, createMdTable, makeHeader, MdHeader, WriterFunction } from "./common";
import { DocumentResourcesTree, EventsRule }                                                  from "../models";


function createRuleDescription(eventsRule: EventsRule) {
    const resultString: string[] = [];

    const RULE_HEADER_LINE: string[] = [
        "Name",
        "Parent Event Bus",
        "State",
    ];

    const ruleTableValues: string[][] = [
        [
            eventsRule.name,
            eventsRule.parentEventBus,
            eventsRule.state,
        ],
    ];

    resultString.push(createMdTable(RULE_HEADER_LINE, ruleTableValues));


    let pattern = eventsRule.pattern;
    if (pattern !== undefined && pattern.length > 0) {
        try {
            const parsedPattern = JSON.parse(pattern);
            const stringify = JSON.stringify(parsedPattern, null, 2);
            pattern = createMdCodeBlock(stringify, CodeSyntax.JSON);
            resultString.push(makeHeader("Pattern:", MdHeader.HEADER_LEVEL_4));
            resultString.push(pattern);
        } catch (e) {
            console.log(e);
        }
    }

    const RULE_TARGET_HEADER_LINE: string[] = [
        "Type",
        "Name",
        "DLQ",
        "SQS Params",
    ];
    const ruleTargetTableValues: string[][] = [];

    eventsRule.targets.forEach(target => {
        ruleTargetTableValues.push([
                                       target.type !== undefined ? target.type : "",
                                       target.name !== undefined ? target.name : "",
                                       target.dlq !== undefined ? target.dlq : "",
                                       target.sqsParams !== undefined ? target.sqsParams : "",
                                   ]);
    });

    resultString.push(makeHeader("Rule Targets:", MdHeader.HEADER_LEVEL_4));
    resultString.push(createMdTable(RULE_TARGET_HEADER_LINE, ruleTargetTableValues));
    return resultString.join("\n");
}

export const writeEventRules: WriterFunction = (resourcesList: DocumentResourcesTree): string => {
    const rules = resourcesList.mappedEventsRule;
    if (rules === undefined || rules.length === 0) {
        return "";
    }
    const resultText: string[] = [];
    const header = makeHeader("AWS Event Rule Information", MdHeader.HEADER_LEVEL_2);
    resultText.push(header);


    for (let i = 0; i < rules.length; i++) {
        resultText.push(makeHeader(rules[i].name, MdHeader.HEADER_LEVEL_3));
        resultText.push(createRuleDescription(rules[i]));
    }

    return resultText.join("\n");
};