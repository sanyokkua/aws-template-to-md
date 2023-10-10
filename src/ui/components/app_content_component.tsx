import React, { useState } from "react";
import { message }         from "antd";
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

const defaultRepoInfo: RepositoryInfo = {
    description: "",
    name: "",
    mainProgrammingLanguage: "",
    deploymentDestination: "",
    deploymentTechnology: "",
    linkToCloudForge: "",
};
const defaultArtifactDesign: ArtifactDesign = {
    linkToTheSolutionDiagram: "",
    linkToTheDiagramImage: "",
};

const defaultParserConfig: ParserConfig = {
    enableLambdaEnvVarValues: false,
    enableStepFunctionDefinition: false,
    templateResourceNamePrefixToRemove: "",
    templateResourceNameSuffixToRemove: "",
};
const defaultOtherMdConfig: OtherAppConfig = {
    enableArchitectureDiagramImgLinkTemplate: true,
    enableStepFunctionDiagramLinkTemplate: true,
    selectedWriters: AVAILABLE_WRITERS.slice(),

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
};

const AppContent: React.FC<any> = (props: any) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [markDownText, setMarkDownText] = useState<string>("");
    const [parserParameters, setParserParameters] = useState<ParserParameters>(defaultParserParameters);

    const parseTemplate = (params: ParserParameters) => {
        try {
            const result = parseCloudFormationTemplate(params);
            setMarkDownText(result);
        } catch (e: any) {
            const errMsgHeader = "Error thrown during parsing passed template";

            let errorMsg: string;
            if (e !== undefined && e.message !== undefined && typeof e.message === "string") {
                errorMsg = `${errMsgHeader}. ${e.message}`;
            } else {
                errorMsg = `${errMsgHeader}`;
            }

            messageApi.open({type: "error", content: errorMsg});
        }
    };

    const onOptionsChange = (options: ParserParameters) => {
        setParserParameters(options);
        parseTemplate(options);
    };

    return <div>
        {contextHolder}
        <ParsingControlPanel params={parserParameters} onParseButtonClicked={(opt) => onOptionsChange(opt)}/>
        <MarkDownComponent markdownText={markDownText} onChange={(data) => setMarkDownText(data)}/>
    </div>;
};

export default AppContent;