import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { Account, EditorInput }                      from "../../../../md/writers/customs/models";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import SubmittedFormValues, { FieldMapping }         from "../../common/submited_form";

type AccountsEditorProps = {
    editorInput: EditorInput<Account[]>;
}

type FormItem = {
    key: number;
    name: number;
    accountName: string;
    accountDescription: string;
    accountID: string;
    accountUrl: string;
}

const AccountsEditor: React.FC<AccountsEditorProps> = (props: AccountsEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
        if (values !== undefined && "accounts" in values && values.accounts.length > 0) {
            const accounts = values.accounts
                                   .map((item: FormItem) => {
                                       const account: Account = {
                                           name: item.accountName,
                                           description: item.accountDescription,
                                           accountId: item.accountID,
                                           accountUrl: item.accountUrl,
                                       };
                                       return account;
                                   })
                                   .filter((account: Account) => {
                                       const hasEmptyName = account.name === undefined || account.name.trim().length === 0;
                                       const hasEmptyDesc = account.description === undefined || account.description.trim().length === 0;
                                       const hasEmptyId = account.accountId === undefined || account.accountId.trim().length === 0;

                                       return !(hasEmptyName || hasEmptyDesc || hasEmptyId);
                                   });

            props.editorInput.onDataChanged(accounts.slice());
            messageApi.success(`Submitted: ${JSON.stringify(accounts, null, 0)}`);
        }
    };

    const initialValue = props.editorInput.data.map((value, id) => {
        return {
            key: id,
            name: id,
            accountName: value.name,
            accountDescription: value.description,
            accountID: value.accountId,
            accountUrl: value.accountUrl,
        };
    });

    return <Card style={{width: "100%"}} title={"Add Accounts"}>
        {contextHolder}
        <Form form={form} name="account_info-form" onFinish={onAddButtonClicked} style={{maxWidth: "100%"}}>

            <Form.List name="accounts" initialValue={initialValue}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{display: "flex", marginBottom: 8}} align="baseline">

                                <Form.Item{...restField} name={[name, "accountName"]} label={"Name"}
                                          rules={[{required: true}]}>
                                    <Input placeholder="Account Name"/>
                                </Form.Item>
                                <Form.Item{...restField} name={[name, "accountDescription"]}
                                          label={"Account Description"} rules={[{required: true}]}>
                                    <Input placeholder="Description"/>
                                </Form.Item>
                                <Form.Item{...restField} name={[name, "accountID"]} label={"ID"}
                                          rules={[{required: true}]}>
                                    <Input placeholder="Account ID"/>
                                </Form.Item>
                                <Form.Item{...restField} name={[name, "accountUrl"]} label={"Url"}
                                          rules={[{required: false}, {type: "url", warningOnly: true}]}>
                                    <Input placeholder="Account Url"/>
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add account
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={props.editorInput.data.map(item => {
            const value = `${item.name}, ${item.description}, ${item.accountId}, ${item.accountUrl}`;
            const val: FieldMapping = {fieldName: "", fieldValue: value};
            return val;
        })} isList={true}/>
    </Card>;
};

export default AccountsEditor;