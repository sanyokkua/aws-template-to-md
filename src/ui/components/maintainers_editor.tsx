import React from "react";

import { Button, Card, Col, Form, Input, List, Row } from "antd";
import { Maintainer }                                from "../../md/writers/customs/models";

type MaintainersEditorProps = {
    maintainersList: Maintainer[];
    onValuesChanged: (maintainers: Maintainer[]) => void;
}
const MaintainersEditor: React.FC<MaintainersEditorProps> = (props: MaintainersEditorProps) => {
    const [form] = Form.useForm();

    const onRemoveItem = (item: Maintainer) => {
        const currentArray = props.maintainersList.slice();
        const result = currentArray
            .filter(curItem => {
                const isThisItem = curItem.name === item.name && curItem.link === item.link && curItem.email === item.email;
                return !isThisItem;
            });
        props.onValuesChanged(result);
    };

    const onAddButtonClicked = () => {
        const name = form.getFieldValue("maintainerName");
        const link = form.getFieldValue("maintainerLink");
        const email = form.getFieldValue("maintainerEmail");

        const isTextFieldNotEmpty = name !== undefined && name.length > 0;
        const isLinkFieldIsNotEmpty = link !== undefined && link.length > 0;
        const isEmailFieldIsNotEmpty = email !== undefined && email.length > 0;

        if (isTextFieldNotEmpty && isLinkFieldIsNotEmpty && isEmailFieldIsNotEmpty) {
            const currentArray = props.maintainersList.slice();
            const found = currentArray
                .find(curItem => (curItem.name === name && curItem.link === link && curItem.email === email));

            if (!found) {
                currentArray.push({name: name, link: link, email: email});
                props.onValuesChanged(currentArray);
            }
        }
    };

    return <Card style={{width: "100%"}} title={"Add Maintainers"}>
        <Form form={form} name="maintainers-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="maintainerName" label="Maintainer Name" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="maintainerLink" label="Maintainer Link" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="maintainerEmail" label="Maintainer Email" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Add</Button>
            </Form.Item>
        </Form>

        <Row>
            <Col span={24}>
                <List itemLayout="horizontal" dataSource={props.maintainersList}
                      renderItem={(item) => (
                          <List.Item actions={[<a key="remove" onClick={() => onRemoveItem(item)}>remove</a>]}>
                              {item.name}, {item.link}, {item.email}
                          </List.Item>
                      )}
                />
            </Col>
        </Row>
    </Card>;
};

export default MaintainersEditor;