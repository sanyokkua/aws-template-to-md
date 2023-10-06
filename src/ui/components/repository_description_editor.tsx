import React from "react";

import { Button, Card, Col, Form, Row } from "antd";
import TextArea                         from "antd/es/input/TextArea";

type RepositoryDescriptionEditorProps = {
    description: string;
    onValuesChanged: (description: string) => void;
}
const RepositoryDescriptionEditor: React.FC<RepositoryDescriptionEditorProps> = (props: RepositoryDescriptionEditorProps) => {
    const [form] = Form.useForm();

    const onAddButtonClicked = () => {
        const description = form.getFieldValue("description");

        if (description !== undefined && description.length > 0) {
            props.onValuesChanged(description);
        }
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        <Form form={form} name="description-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="description" label="Description of repository" rules={[{required: true}]}>
                <TextArea rows={4}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Add</Button>
            </Form.Item>
        </Form>
        <Row>
            <Col span={24}>
                <h5>Description:</h5>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                {props.description}
            </Col>
        </Row>

    </Card>;
};

export default RepositoryDescriptionEditor;