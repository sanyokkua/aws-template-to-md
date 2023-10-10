import React from "react";

import { Button, Card, Col, Form, Input, List, Row } from "antd";
import { RepositoryTag }                             from "../../../../md/writers/customs/models";

type RepositoryTagsEditorProps = {
    repositoryTags: RepositoryTag[];
    onValuesChanged: (repositoryTags: RepositoryTag[]) => void;
}
const RepositoryTagsEditor: React.FC<RepositoryTagsEditorProps> = (props: RepositoryTagsEditorProps) => {
    const [form] = Form.useForm();

    const onRemoveItem = (item: RepositoryTag) => {
        const currentArray = props.repositoryTags.slice();
        const result = currentArray.filter(curItem => !(curItem.text === item.text && curItem.imgLink === item.imgLink));
        props.onValuesChanged(result);
    };

    const onAddButtonClicked = () => {
        const text = form.getFieldValue("RepositoryTagText");
        const link = form.getFieldValue("RepositoryTagLink");

        const isTextFieldNotEmpty = text !== undefined && text.length > 0;
        const isLinkFieldIsNotEmpty = link !== undefined && link.length > 0;

        if (isTextFieldNotEmpty && isLinkFieldIsNotEmpty) {
            const currentArray = props.repositoryTags.slice();
            const found = currentArray.find(curItem => (curItem.text === text && curItem.imgLink === link));

            if (!found) {
                currentArray.push({text: text, imgLink: link});
                props.onValuesChanged(currentArray);
            }
        }
    };

    return <Card style={{width: "100%"}} title={"Add RepositoryTags"}>
        <Form form={form} name="RepositoryTag-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="RepositoryTagText" label="RepositoryTag Text" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="RepositoryTagLink" label="RepositoryTag Link" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <Row><h3>Confirmed Values:</h3></Row>
        <Row>
            <Col span={24}>
                <List itemLayout="horizontal" dataSource={props.repositoryTags}
                      renderItem={(item) => (
                          <List.Item actions={[<a key="remove" onClick={() => onRemoveItem(item)}>remove</a>]}>
                              {item.text}, {item.imgLink}
                          </List.Item>
                      )}
                />
            </Col>
        </Row>
    </Card>;
};

export default RepositoryTagsEditor;