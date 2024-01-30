import React, { useState }                         from "react";
import { Button, Card, Col, message, Row, Switch } from "antd";
import MarkdownEditorPlusViewer, { Show }          from "../../../../../common/markdown/markdown_editor_plus_viewer";

type CustomMarkdownConfigurationProps = {
    markdown: string;
    onChange: (markdown: string) => void;
}
const CustomMarkdownConfiguration: React.FC<CustomMarkdownConfigurationProps> = (props: CustomMarkdownConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [markdownText, setMarkdownText] = useState(props.markdown ?? "");
    const [showPreview, setShowPreview] = useState(Show.EDITOR);

    const onChange = (checked: boolean) => {
        let show;
        if (checked) {
            show = Show.BOTH;
        } else {
            show = Show.EDITOR;
        }
        setShowPreview(show);
    };

    const onSubmit = () => {
        props.onChange(markdownText);
        messageApi.info("Custom Markdown Text Value is Changed");
        console.log(markdownText);
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