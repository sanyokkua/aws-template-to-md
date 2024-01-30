import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import { AccountInformation }                        from "../../../../../../../../core/config/models";
import { isEmptyString }                             from "../../../../../../../../core/string_utils";

type AccountsConfigurationProps = {
    accounts: AccountInformation[];
    onChange: (accounts: AccountInformation[]) => void;
}

type FormItem = {
    key: number;
    name: number;
    accountName: string;
    accountDescription: string;
    accountID: string;
    accountUrl: string;
}

const AccountsConfiguration: React.FC<AccountsConfigurationProps> = (props: AccountsConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const initialValue = props.accounts.map((value, id) => {
        return {
            key: id,
            name: id,
            accountName: value.name,
            accountDescription: value.description,
            accountID: value.accountId,
            accountUrl: value.accountUrl,
        };
    });

    const onFormSubmit = (values?: any) => {
        if (values === undefined || !("accounts" in values)) {
            messageApi.warning("Form is not returned list of items");
            return;
        }

        if (values.accounts.length > 0) {
            const accounts = values.accounts
                                   .map((item: FormItem) => mapFormItemToAccount(item))
                                   .filter((account: AccountInformation) => isAccountEmpty(account));

            props.onChange(accounts.slice());// Slice required to make a copy of array, React expects new object to update
            messageApi.info("Accounts Information Values are Changed");
            console.log(accounts);
            return;
        }

        messageApi.warning("No Update happen");
    };

    return <Card style={{width: "100%"}} title={"Add Accounts"}>
        {contextHolder}
        <Form form={form} name="AccountInformationForm" onFinish={onFormSubmit} style={{maxWidth: "100%"}}>
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
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

function mapFormItemToAccount(item: FormItem) {
    const account: AccountInformation = {
        name: item.accountName,
        description: item.accountDescription,
        accountId: item.accountID,
        accountUrl: item.accountUrl,
    };
    return account;
}

function isAccountEmpty(account: AccountInformation) {
    const hasEmptyName = isEmptyString(account.name);
    const hasEmptyDesc = isEmptyString(account.description);
    const hasEmptyId = isEmptyString(account.accountId);

    return !(hasEmptyName || hasEmptyDesc || hasEmptyId);
}

export default AccountsConfiguration;