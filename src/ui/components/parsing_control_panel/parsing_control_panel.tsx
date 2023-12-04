import React, { useState }                   from "react";
import { Button, message }                   from "antd";
import {
    Account,
    ArtifactDesign,
    Maintainer,
    OtherAppConfig,
    ParserConfig,
    ParserParameters,
    RepositoryInfo,
    RepositoryTag,
}                                            from "../../../md/writers/customs/models";
import ParsingControlPanelHeaderLine         from "./components/parsing_control_panel_header_line";
import ParsingControlPanelJsonTemplateEditor from "./components/parsing_control_panel_json_template_editor";
import EditorSelector                        from "./components/editor_selector_component";
import { getFromClipboard }                  from "../../../utils/utils";

type ParsingControlPanelProps = {
    params: ParserParameters;
    onParseButtonClicked: (options: ParserParameters) => void;
}


const ParsingControlPanel: React.FC<ParsingControlPanelProps> = (props: ParsingControlPanelProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    // Component Controls
    const [showTemplateJsonSwitch, setShowTemplateJsonSwitch] = useState<boolean>(true);
    const [showParsingConfigSwitch, setShowParsingConfigSwitch] = useState<boolean>(true);

    // Component Result Values
    const [jsonTemplateValue, setJsonTemplateValue] = useState<string>(props.params.templateJsonValue);
    const [repositoryTags, setRepositoryTags] = useState<RepositoryTag[]>(props.params.repositoryTags);
    const [repositoryMaintainers, setRepositoryMaintainers] = useState<Maintainer[]>(props.params.repositoryMaintainers);
    const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo>(props.params.repositoryInformation);
    const [accounts, setAccounts] = useState<Account[]>(props.params.accountsInformation);
    const [designInfo, setDesignInfo] = useState<ArtifactDesign>(props.params.artifactDesign);
    const [customMdText, setCustomMdText] = useState<string>(props.params.additionalMarkdownContent);
    const [parserConfig, setParserConfig] = useState<ParserConfig>(props.params.parserConfig);
    const [otherMarkdownConfig, setOtherMarkdownConfig] = useState<OtherAppConfig>(props.params.otherAppConfig);

    const onParseButtonClicked = () => {
        props.onParseButtonClicked({
                                       templateJsonValue: jsonTemplateValue,
                                       repositoryTags: repositoryTags,
                                       repositoryInformation: repositoryInfo,
                                       repositoryMaintainers: repositoryMaintainers,
                                       accountsInformation: accounts,
                                       artifactDesign: designInfo,
                                       additionalMarkdownContent: customMdText,
                                       parserConfig: parserConfig,
                                       otherAppConfig: otherMarkdownConfig,
                                   });
    };

    return <>
        {contextHolder}
        <ParsingControlPanelHeaderLine
            hideControlsPanel={showParsingConfigSwitch}
            hideJsonEditor={showTemplateJsonSwitch}
            onSetJsonTemplateBtnClicked={() => {
                getFromClipboard()
                    .then((text) => {
                        setJsonTemplateValue(text);
                        messageApi.open({type: "info", content: "Json Template is Pasted"});
                    })
                    .catch(err => {
                        console.error(err);
                        messageApi.open({type: "error", content: "Problem Occurred during pasting Json Template"});
                    });
            }}
            onHideControlSwitchClicked={(checked: boolean) => setShowParsingConfigSwitch(checked)}
            onHideJsonSwitchClicked={(checked: boolean) => setShowTemplateJsonSwitch(checked)}/>

        <ParsingControlPanelJsonTemplateEditor
            showElement={showTemplateJsonSwitch}
            jsonTemplate={jsonTemplateValue}
            onChange={(data) => setJsonTemplateValue(data)}/>

        <br/>

        <EditorSelector
            showElement={showParsingConfigSwitch}
            repositoryTags={{data: repositoryTags, onDataChanged: setRepositoryTags}}
            maintainers={{data: repositoryMaintainers, onDataChanged: setRepositoryMaintainers}}
            repositoryInfo={{data: repositoryInfo, onDataChanged: setRepositoryInfo}}
            accounts={{data: accounts, onDataChanged: setAccounts}}
            artifactDesign={{data: designInfo, onDataChanged: setDesignInfo}}
            parserConfig={{data: parserConfig, onDataChanged: setParserConfig}}
            customMdText={{data: customMdText, onDataChanged: setCustomMdText}}
            otherAppConfig={{data: otherMarkdownConfig, onDataChanged: setOtherMarkdownConfig}}
        />

        <br/>

        <Button type="primary" onClick={() => onParseButtonClicked()}>Parse</Button>
    </>;
};

export default ParsingControlPanel;