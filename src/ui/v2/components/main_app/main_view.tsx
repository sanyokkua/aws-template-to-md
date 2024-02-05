import React, { useState }                                          from "react";
import ResultContentComponent                                       from "./views/result/result_view";
import { Button, Flex, message }                                    from "antd";
import ControlsContentView                                          from "./views/controls/controls_view";
import { isEmptyString }                                            from "../../../../core/string_utils";
import { AVAILABLE_APP_CONFIGURATORS, DefaultParsingConfiguration } from "../../../../core/config/constatns";
import { copyToClipboard }                                          from "../../../../core/clipboard_utils";
import { parseCloudFormationTemplate }                              from "../../../../core/cloudformation_parser";
import { saveTextAsFile }                                           from "../../../../core/file_save_utils";
import { loadAppConfiguration, saveAppConfiguration }               from "../../../../core/config/config_storage";
import { ParsingConfiguration }                                     from "../../../../core/config/models";
import { DownloadOutlined }                                         from "@ant-design/icons";
import logger                                                       from "../../../../logger";


const MainAppView: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    // ControlsContentView
    const [switchEditorState, setSwitchEditorState] = useState(false);
    const [switchControlState, setSwitchControlState] = useState(false);
    const [fileName, setFileName] = useState("");
    const [jsonTemplate, setJsonTemplate] = useState("");
    const [parsingConfiguration, setParsingConfiguration] = useState(loadAppConfiguration());
    const [selectedEditor, setSelectedEditor] = useState<string>(AVAILABLE_APP_CONFIGURATORS[0]);

    // ResultContentComponent
    const [markdownResult, setMarkdownResult] = useState("");

    // Internal logic
    const showParseButton: boolean = !isEmptyString(jsonTemplate);
    const showCopyButton: boolean = !isEmptyString(markdownResult);
    const showSaveButton: boolean = !isEmptyString(markdownResult);

    logger.debug(switchEditorState, "Value of switchEditorState");
    logger.debug(switchControlState, "Value of switchControlState");
    logger.debug(fileName, "Value of fileName");
    logger.debug(jsonTemplate, "Value of jsonTemplate");
    logger.debug(parsingConfiguration, "Value of parsingConfiguration");
    logger.debug(selectedEditor, "Value of selectedEditor");
    logger.debug(markdownResult, "Value of markdownResult");
    logger.debug(showParseButton, "Value of showParseButton");
    logger.debug(showCopyButton, "Value of showCopyButton");
    logger.debug(showSaveButton, "Value of showSaveButton");

    const parseJsonTemplate = () => {
        try {
            const result = parseCloudFormationTemplate(jsonTemplate, parsingConfiguration);
            setMarkdownResult(result);
            messageApi.success("JsonTemplate parsed");
            logger.debug(result, "Result of the parseCloudFormationTemplate");
        } catch (e: any) {
            messageApi.error("Error occurred during parsing CloudFormationTemplate, check logs for details");
            logger.warn(e, "Error occurred during parsing CloudFormationTemplate");
        }
    };

    const updateParsingConfig = (config: ParsingConfiguration) => {
        setParsingConfiguration(config);
        saveAppConfiguration(config);
        messageApi.success("Parsing Configuration was updated");
        logger.debug(config, "ParsingConfiguration that was passed to updateParsingConfig");
    };

    const copyResultMarkdown = () => {
        copyToClipboard(markdownResult);
        messageApi.success("Markdown Text copied to clipboard");
        logger.debug(markdownResult, "This was copied to clipboard");
    };

    const saveMarkdownToFile = () => {
        const repoName = parsingConfiguration.repositoryInfo.repositoryName;
        logger.debug(repoName, "Repository name that was retrieved in saveMarkdownToFile");
        let fileName: string;
        if (isEmptyString(repoName)) {
            fileName = "README.md";
        } else {
            fileName = `${repoName}.md`;
        }
        saveTextAsFile(markdownResult, fileName);
        messageApi.success("Markdown Text copied to clipboard");
        logger.debug(fileName, "Generated file name in saveMarkdownToFile");
    };

    return <>
        {contextHolder}

        <ControlsContentView
            fileName={fileName}
            onFileNameUpdated={(value) => setFileName(value)}

            jsonTemplate={jsonTemplate}
            onJsonTemplateUpdated={(value) => setJsonTemplate(value)}

            parsingConfiguration={parsingConfiguration}
            onParsingConfigurationChanged={(config) => updateParsingConfig(config)}

            switchControlState={switchControlState}
            onSwitchControlStateUpdated={(value) => setSwitchControlState(value)}

            switchEditorState={switchEditorState}
            onSwitchEditorStateUpdated={(value) => setSwitchEditorState(value)}

            selectedEditor={selectedEditor}
            onEditorChange={(value) => setSelectedEditor(value)}

            onResetButtonClicked={() => updateParsingConfig(DefaultParsingConfiguration)}
        />
        <br/>
        <Flex gap="small" wrap="wrap" align={"center"} justify={"center"}>
            {showParseButton && <Button type="primary" size={"large"}
                                        onClick={() => parseJsonTemplate()}>Parse Template</Button>}
            {showCopyButton && <Button type="default" size={"large"}
                                       onClick={() => copyResultMarkdown()}>Copy Result Markdown</Button>}
            {showSaveButton && <Button type="dashed" size={"large"} icon={<DownloadOutlined/>}
                                       onClick={() => saveMarkdownToFile()}>Save Markdown to File</Button>}
        </Flex>
        <br/>
        <ResultContentComponent markdownText={markdownResult} onChange={(content) => setMarkdownResult(content)}/>
    </>;
};

export default MainAppView;