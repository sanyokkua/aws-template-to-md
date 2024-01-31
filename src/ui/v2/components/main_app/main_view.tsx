import React, { useState }                                          from "react";
import ResultContentComponent                                       from "./views/result/result_view";
import { Button, Flex, message }                                    from "antd";
import ControlsContentView                                          from "./views/controls/controls_view";
import { isEmptyString }                                            from "../../../../core/string_utils";
import { AVAILABLE_APP_CONFIGURATORS, DefaultParsingConfiguration } from "../../../../core/config/constatns";
import { copyToClipboard }                                          from "../../../../core/clipboard_utils";
import { parseCloudFormationTemplate }                              from "../../../../core/cloudformation_parser";


const MainAppView: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    // ControlsContentView
    const [switchEditorState, setSwitchEditorState] = useState(false);
    const [switchControlState, setSwitchControlState] = useState(false);
    const [fileName, setFileName] = useState("");
    const [jsonTemplate, setJsonTemplate] = useState("");
    const [parsingConfiguration, setParsingConfiguration] = useState(DefaultParsingConfiguration);
    const [selectedEditor, setSelectedEditor] = useState<string>(AVAILABLE_APP_CONFIGURATORS[0]);

    // ResultContentComponent
    const [markdownResult, setMarkdownResult] = useState("");

    // Internal logic
    const showParseButton: boolean = !isEmptyString(jsonTemplate);
    const showCopyButton: boolean = !isEmptyString(markdownResult);

    const parseJsonTemplate = () => {
        try {
            const result = parseCloudFormationTemplate(jsonTemplate, parsingConfiguration);
            setMarkdownResult(result);
            messageApi.success("JsonTemplate parsed");
        } catch (e: any) {
            messageApi.error("Error occurred during parsing CloudFormationTemplate, check logs for details");
            console.log(e);
        }
    };

    const copyResultMarkdown = () => {
        copyToClipboard(markdownResult);
        messageApi.success("Markdown Text copied to clipboard");
    };

    return <>
        {contextHolder}

        <ControlsContentView
            fileName={fileName}
            onFileNameUpdated={(value) => setFileName(value)}

            jsonTemplate={jsonTemplate}
            onJsonTemplateUpdated={(value) => setJsonTemplate(value)}

            parsingConfiguration={parsingConfiguration}
            onParsingConfigurationChanged={(config) => setParsingConfiguration(config)}

            switchControlState={switchControlState}
            onSwitchControlStateUpdated={(value) => setSwitchControlState(value)}

            switchEditorState={switchEditorState}
            onSwitchEditorStateUpdated={(value) => setSwitchEditorState(value)}

            selectedEditor={selectedEditor}
            onEditorChange={(value) => setSelectedEditor(value)}
        />
        <br/>
        <Flex gap="small" wrap="wrap" align={"center"} justify={"center"}>
            {showParseButton && <Button type="primary" size={"large"}
                                        onClick={() => parseJsonTemplate()}>Parse Template</Button>}
            {showCopyButton && <Button type="default" size={"large"}
                                       onClick={() => copyResultMarkdown()}>Copy Result Markdown</Button>}
        </Flex>
        <br/>
        <ResultContentComponent markdownText={markdownResult} onChange={(content) => setMarkdownResult(content)}/>
    </>;
};

export default MainAppView;