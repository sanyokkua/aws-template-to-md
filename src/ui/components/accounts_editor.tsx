import React from "react";

import { Button, Card, Col, Form, Input, List, Row } from "antd";
import { AccountInfo }                               from "../../md/writers/customs/models";

type AccountsEditorProps = {
    accountList: AccountInfo[];
    onValuesChanged: (accounts: AccountInfo[]) => void;
}
const AccountsEditor: React.FC<AccountsEditorProps> = (props: AccountsEditorProps) => {
    const [form] = Form.useForm();

    const onRemoveItem = (item: AccountInfo) => {
        const currentArray = props.accountList.slice();
        const result = currentArray
            .filter(curItem => {
                const isThisItem = curItem.organizationName === item.organizationName &&
                    curItem.description === item.description &&
                    curItem.accountId === item.accountId;
                return !isThisItem;
            });
        props.onValuesChanged(result);
    };

    const onAddButtonClicked = () => {
        const orgName = form.getFieldValue("orgName");
        const orgDesc = form.getFieldValue("orgDesc");
        const accountId = form.getFieldValue("accountId");

        const isNameFieldNotEmpty = orgName !== undefined && orgName.length > 0;
        const isDescriptionFieldIsNotEmpty = orgDesc !== undefined && orgDesc.length > 0;
        const isAccountIdFieldIsNotEmpty = accountId !== undefined && accountId.length > 0;

        if (isNameFieldNotEmpty && isDescriptionFieldIsNotEmpty && isAccountIdFieldIsNotEmpty) {
            const currentArray = props.accountList.slice();
            const found = currentArray
                .find(curItem => (curItem.organizationName === orgName &&
                    curItem.description === orgDesc &&
                    curItem.accountId === accountId));

            if (!found) {
                currentArray.push({organizationName: orgName, description: orgDesc, accountId: accountId});
                props.onValuesChanged(currentArray);
            }
        }
    };

    return <Card style={{width: "100%"}} title={"Add Accounts"}>
        <Form form={form} name="account_info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="orgName" label="Organization Name" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="orgDesc" label="Description" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="accountId" label="Account ID" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Add</Button>
            </Form.Item>
        </Form>

        <Row>
            <Col span={24}>
                <List itemLayout="horizontal" dataSource={props.accountList}
                      renderItem={(item) => (
                          <List.Item actions={[<a key="remove" onClick={() => onRemoveItem(item)}>remove</a>]}>
                              {item.organizationName}, {item.description}, {item.accountId}
                          </List.Item>
                      )}
                />
            </Col>
        </Row>
    </Card>;
};

export default AccountsEditor;