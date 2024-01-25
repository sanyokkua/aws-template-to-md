import React, { useState } from "react";
import { Button, message } from "antd";
import ParsingControlPanel from "./parsing_control_panel/parsing_control_panel";
import {
    AVAILABLE_WRITERS,
    parseCloudFormationTemplate,
}                          from "../../md/document_parser";
import {
    ArtifactDesign,
    OtherAppConfig,
    ParserConfig,
    ParserParameters,
    RepositoryInfo,
}                          from "../../md/writers/customs/models";
import MarkDownComponent   from "./markdown_component";
import { copyToClipboard } from "../../utils/utils";
import {
    createRawCloudFormationResourcesCollection,
    parseCloudFormationTemplate2,
}                          from "../../core/cloudformation/json_parser";
import {
    createDocumentResourcesTree,
}                          from "../../core/mapping/cloudformation_mapper";

const defaultRepoInfo: RepositoryInfo = {
    description: "",
    name: "",
    mainProgrammingLanguage: "",
    deploymentDestination: "",
    deploymentTechnology: "",
    linkToCloudForge: "",
    deploymentTechnologyDocs: "",
    branchingStrategy: "",
    ciDocumentation: "",
    ciBuildPage: "",
    ciDeployPage: "",
};
const defaultArtifactDesign: ArtifactDesign = {
    linkToTheSolutionDiagram: "",
    linkToTheDiagramImage: "",
};
const defaultParserConfig: ParserConfig = {
    enableLambdaEnvVarValues: false,
    enableStepFunctionDefinition: false,
    enableDynamoDbExampleStubs: true,
    templateResourceNamePrefixToRemove: "",
    templateResourceNameSuffixToRemove: "",
};
const defaultOtherMdConfig: OtherAppConfig = {
    enableArchitectureDiagramImgLinkTemplate: true,
    enableStepFunctionDiagramLinkTemplate: true,
    selectedWriters: AVAILABLE_WRITERS.slice(),
    showOpenApiStub: true,
    showApiGatewayUsageInstructionStub: true,
    showApiMaintainerColumn: true,
    showApiDocsLinkColumn: true,
    showPostmanStub: true,
    showPostmanSecretsLink: true,

};
const defaultParserParameters: ParserParameters = {
    parserConfig: defaultParserConfig,
    templateJsonValue: "",
    repositoryTags: [],
    repositoryInformation: defaultRepoInfo,
    repositoryMaintainers: [],
    accountsInformation: [],
    artifactDesign: defaultArtifactDesign,
    additionalMarkdownContent: "",
    otherAppConfig: defaultOtherMdConfig,
    relatedProjects: {projects: []},
};

function buildErrorMsg(e: any) {
    const errMsgHeader = "Error thrown during parsing passed template";

    if (e !== undefined && e.message !== undefined && typeof e.message === "string") {
        return `${errMsgHeader}. ${e.message}`;
    } else {
        return `${errMsgHeader}`;
    }
}

const AppContent: React.FC<any> = (props: any) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [parserParameters, setParserParameters] = useState<ParserParameters>(defaultParserParameters);
    const [markDownText, setMarkDownText] = useState<string>("");

    const onOptionsChange = (parserParams: ParserParameters) => {
        setParserParameters(parserParams);
        parseTemplate(parserParams);
    };

    const parseTemplate = (params: ParserParameters) => {
        try {
            const markdownDocument: string = parseCloudFormationTemplate(params);
            // TODO: switch to new parser
            const res = parseCloudFormationTemplate2(params.templateJsonValue);
            const res2 = createRawCloudFormationResourcesCollection(res);
            const res3 = createDocumentResourcesTree(res2);
            setMarkDownText(markdownDocument);
        } catch (e: any) {
            const errorMsg = buildErrorMsg(e);
            messageApi.open({type: "error", content: errorMsg});
        }
    };

    const copyMarkdown = () => {
        copyToClipboard(markDownText);
        messageApi.open({type: "info", content: "Markdown is copied to clipboard"});
    };

    return <>
        {contextHolder}

        <ParsingControlPanel params={parserParameters}
                             onParseButtonClicked={(opt) => onOptionsChange(opt)}/>
        {markDownText !== undefined && markDownText !== null && markDownText.length > 0 && <>
            <Button onClick={() => copyMarkdown()}>Copy MarkDown</Button>
        </>}
        <MarkDownComponent markdownText={markDownText}
                           onChange={(data) => setMarkDownText(data)}/>
    </>;
};

export default AppContent;