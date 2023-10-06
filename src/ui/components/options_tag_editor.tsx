import React from "react";

import { Button, Card, Col, Form, Input, List, Row } from "antd";
import { Tag }                                       from "../../md/writers/customs/models";

type OptionsTagEditorProps = {
    tagsList: Tag[];
    onValuesChanged: (tags: Tag[]) => void;
}
const OptionsTagEditor: React.FC<OptionsTagEditorProps> = (props: OptionsTagEditorProps) => {
    const [form] = Form.useForm();

    const onRemoveItem = (item: Tag) => {
        const currentArray = props.tagsList.slice();
        const result = currentArray.filter(curItem => !(curItem.text === item.text && curItem.imgLink === item.imgLink));
        props.onValuesChanged(result);
    };

    const onAddButtonClicked = () => {
        const text = form.getFieldValue("tagText");
        const link = form.getFieldValue("tagLink");

        const isTextFieldNotEmpty = text !== undefined && text.length > 0;
        const isLinkFieldIsNotEmpty = link !== undefined && link.length > 0;

        if (isTextFieldNotEmpty && isLinkFieldIsNotEmpty) {
            const currentArray = props.tagsList.slice();
            const found = currentArray.find(curItem => (curItem.text === text && curItem.imgLink === link));

            if (!found) {
                currentArray.push({text: text, imgLink: link});
                props.onValuesChanged(currentArray);
            }
        }
    };

    return <Card style={{width: "100%"}} title={"Add Tags"}>
        <Form form={form} name="tag-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="tagText" label="Tag Text" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="tagLink" label="Tag Link" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Add</Button>
            </Form.Item>
        </Form>

        <Row>
            <Col span={24}>
                <List itemLayout="horizontal" dataSource={props.tagsList}
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

export default OptionsTagEditor;