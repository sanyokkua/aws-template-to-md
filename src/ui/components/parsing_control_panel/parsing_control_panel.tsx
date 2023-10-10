import React, { useState }                   from "react";
import { Button, Col, Row }                  from "antd";
import JsonInputModal                        from "./json_input_modal";
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

type ParsingControlPanelProps = {
    params: ParserParameters;
    onParseButtonClicked: (options: ParserParameters) => void;
}


const ParsingControlPanel: React.FC<ParsingControlPanelProps> = (props: ParsingControlPanelProps) => {
    // Component Controls
    const [showTemplateJsonSwitch, setShowTemplateJsonSwitch] = useState<boolean>(false);
    const [showOptionsSwitch, setShowOptionsSwitch] = useState<boolean>(true);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    // Component Result Values
    const [jsonTemplateValue, setJsonTemplateValue] = useState<string>(props.params.templateJsonValue);
    const [tags, setTags] = useState<RepositoryTag[]>(props.params.repositoryTags);
    const [maintainers, setMaintainers] = useState<Maintainer[]>(props.params.repositoryMaintainers);
    const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo>(props.params.repositoryInformation);
    const [accountInfo, setAccountInfo] = useState<Account[]>(props.params.accountsInformation);
    const [designInfo, setDesignInfo] = useState<ArtifactDesign>(props.params.artifactDesign);
    const [customMdText, setCustomMdText] = useState<string>(props.params.additionalMarkdownContent);
    const [parserConfig, setParserConfig] = useState<ParserConfig>(props.params.parserConfig);
    const [otherMarkdownConfig, setOtherMarkdownConfig] = useState<OtherAppConfig>(props.params.otherAppConfig);


    const onShowOptionsSwitchChanged = (checked: boolean) => setShowOptionsSwitch(checked);
    const onShowJsonSwitchChanged = (checked: boolean) => setShowTemplateJsonSwitch(checked);
    const onSetCloudFormButtonClicked = () => setModalIsOpen(true);
    const onParseButtonClicked = () => {
        props.onParseButtonClicked({
                                       templateJsonValue: jsonTemplateValue,
                                       repositoryTags: tags,
                                       repositoryInformation: repositoryInfo,
                                       repositoryMaintainers: maintainers,
                                       accountsInformation: accountInfo,
                                       artifactDesign: designInfo,
                                       additionalMarkdownContent: customMdText,
                                       parserConfig: parserConfig,
                                       otherAppConfig: otherMarkdownConfig,
                                   });
    };

    function handleModalData(data: string) {
        setJsonTemplateValue(data);
        setModalIsOpen(false);
    }

    return <Row>
        <Col span={24}>
            <ParsingControlPanelHeaderLine hideOptions={showOptionsSwitch}
                                           hideJson={showTemplateJsonSwitch}
                                           onSetJsonTemplateBtnClicked={onSetCloudFormButtonClicked}
                                           onHideOptionsSwitchClicked={onShowOptionsSwitchChanged}
                                           onHideJsonSwitchClicked={onShowJsonSwitchChanged}/>

            <ParsingControlPanelJsonTemplateEditor showElement={showTemplateJsonSwitch}
                                                   jsonTemplate={jsonTemplateValue}
                                                   onChange={(data) => setJsonTemplateValue(data)}/>

            <EditorSelector showElement={showOptionsSwitch}
                            listOfRepositoryTags={tags}
                            listOfMaintainers={maintainers}
                            repositoryInfo={repositoryInfo}
                            listOfAccounts={accountInfo}
                            artifactDesign={designInfo}
                            customMdText={customMdText}
                            parserConfig={parserConfig}
                            otherAppConfig={otherMarkdownConfig}
                            onSetListOfRepositoryTags={setTags}
                            onSetListOfMaintainers={setMaintainers}
                            onSetRepositoryInfo={setRepositoryInfo}
                            onSetListOfAccounts={setAccountInfo}
                            onSetArtifactDesign={setDesignInfo}
                            onSetCustomMdText={setCustomMdText}
                            onSetParserConfig={setParserConfig}
                            onSetOtherAppConfig={setOtherMarkdownConfig}/>

            <Row>
                <Col span={24}>
                    <Button type="primary" onClick={() => onParseButtonClicked()}>Parse</Button>
                </Col>
            </Row>

            <JsonInputModal isOpen={modalIsOpen} onConfirm={(data) => handleModalData(data)}
                            onCancel={() => setModalIsOpen(false)}/>
        </Col>
    </Row>;
};

export default ParsingControlPanel;