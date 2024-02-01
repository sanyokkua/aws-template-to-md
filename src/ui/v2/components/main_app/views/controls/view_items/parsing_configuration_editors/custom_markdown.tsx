import React, { useState }                         from "react";
import { Button, Card, Col, message, Row, Switch } from "antd";
import MarkdownEditorPlusViewer, { Show }          from "../../../../../common/markdown/markdown_editor_plus_viewer";
import logger from "../../../../../../../../logger";

type CustomMarkdownConfigurationProps = {
    markdown: string;
    onChange: (markdown: string) => void;
}
const CustomMarkdownConfiguration: React.FC<CustomMarkdownConfigurationProps> = (props: CustomMarkdownConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [markdownText, setMarkdownText] = useState(props.markdown ?? "");
    const [showPreview, setShowPreview] = useState(Show.EDITOR);

    logger.debug(markdownText, "CustomMarkdownConfiguration, initialValue");

    const onChange = (checked: boolean) => {
        let show;
        if (checked) {
            show = Show.BOTH;
        } else {
            show = Show.EDITOR;
        }
        setShowPreview(show);
        logger.debug(show, "CustomMarkdownConfiguration, onChange");
    };

    const onSubmit = () => {
        props.onChange(markdownText);
        messageApi.info("Custom Markdown Text Value is Changed");
        logger.debug(markdownText, "CustomMarkdownConfiguration, onSubmit");
    };

    return <Card style={{width: "100%"}} title={"Add Custom MD text to end of document"}>
        {contextHolder}
        <Row>
            <Col>Show Preview: </Col>
            <Col><Switch onChange={onChange}/></Col>
        </Row>

        <MarkdownEditorPlusViewer
            show={showPreview}
            markdownText={markdownText}
            onChange={(value) => setMarkdownText(value)}/>
        <Button type="dashed" onClick={() => onSubmit()}>Submit Data</Button>
    </Card>;
};

export default CustomMarkdownConfiguration;