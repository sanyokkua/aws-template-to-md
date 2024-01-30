import React                                    from "react";
import UploadText, { UploadResult }             from "../../../../common/upload_text";
import { Alert, Button, Flex, message, Switch } from "antd";
import { pasteFromClipboard }                   from "../../../../../../../core/clipboard_utils";
import { isEmptyString }                        from "../../../../../../../core/string_utils";


export type MainControlHeaderButtonsProps = {
    onJsonTemplateChanged: (content: string) => void;
    onFileNameChanged: (content: string) => void;
    onEditorSwitchChanged: (checked: boolean) => void;
    onControlSwitchChanged: (checked: boolean) => void;

    switchEditorValue: boolean;
    switchControlValue: boolean;
    uploadedFileName?: string;
}

const MainControlHeaderButtonsView: React.FC<MainControlHeaderButtonsProps> = (props: MainControlHeaderButtonsProps) => {
    const [messageApi, contextHolder] = message.useMessage();

    let fileName;
    if (!isEmptyString(props.uploadedFileName)) {
        fileName = <Alert message={props.uploadedFileName} type="success"/>;
    }

    const onDataIsChanged = (value: UploadResult) => {
        props.onJsonTemplateChanged(value.fileContent);
        props.onFileNameChanged(value.fileName);
    };
    const onPasteBtnClick = () => {
        pasteFromClipboard()
            .then(resultContent => {
                messageApi.success("Successfully pasted text from clipboard");
                onDataIsChanged({fileContent: resultContent, fileName: "Pasted From Clipboard"});
            })
            .catch(error => {
                messageApi.error("Failed to paste text from clipboard, check console for errors");
                console.error(error);
            });
    };

    return (
        <>
            {contextHolder}

            <Flex gap="small" wrap="wrap" align={"center"} justify={"center"}>
                <UploadText onTextUploaded={(result) => onDataIsChanged(result)}/>
                <Button onClick={() => onPasteBtnClick()}>Paste from clipboard</Button>
                <Switch checkedChildren="Hide Controls" unCheckedChildren="Show Controls"
                        onChange={(value) => props.onControlSwitchChanged(value)}
                        checked={props.switchControlValue}/>
                <Switch checkedChildren="Hide Editor" unCheckedChildren="Show Editor"
                        onChange={(value) => props.onEditorSwitchChanged(value)}
                        checked={props.switchEditorValue}/>
                {fileName}
            </Flex>
        </>
    );
};

export default MainControlHeaderButtonsView;