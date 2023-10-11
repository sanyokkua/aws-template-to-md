import React from "react";

import { Button, Card, Col, Form, Input, Row } from "antd";
import { ArtifactDesign, EditorInput }         from "../../../../md/writers/customs/models";

type ArtifactDesignEditorProps = {
    editorInput: EditorInput<ArtifactDesign>;
}
const ArtifactDesignEditor: React.FC<ArtifactDesignEditorProps> = (props: ArtifactDesignEditorProps) => {
    const [form] = Form.useForm();

    const onAddButtonClicked = () => {
        const linkToTheSolutionDiagram = form.getFieldValue("linkToTheSolutionDiagram");
        const linkToTheDiagramImage = form.getFieldValue("linkToTheDiagramImage");

        const isLinkToSolutionIsNotEmpty = linkToTheSolutionDiagram !== undefined && linkToTheSolutionDiagram.length > 0;
        const isLinkToTheDiagramImageIsNotEmpty = linkToTheDiagramImage !== undefined && linkToTheDiagramImage.length > 0;

        if (isLinkToSolutionIsNotEmpty && isLinkToTheDiagramImageIsNotEmpty) {
            props.editorInput.onDataChanged({
                                                linkToTheSolutionDiagram: linkToTheSolutionDiagram,
                                                linkToTheDiagramImage: linkToTheDiagramImage,
                                            });
        }
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        <Form form={form} name="design-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="linkToTheSolutionDiagram" label="Link to the solution diagram" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="linkToTheDiagramImage" label="Link to the diagram image" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
        <Row>
            <Col span={12}>
                Link to the solution diagram:
            </Col>
            <Col span={12}>
                {props.editorInput.data.linkToTheSolutionDiagram}
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                Link to the diagram image
            </Col>
            <Col span={12}>
                {props.editorInput.data.linkToTheDiagramImage}
            </Col>
        </Row>
    </Card>;
};

export default ArtifactDesignEditor;