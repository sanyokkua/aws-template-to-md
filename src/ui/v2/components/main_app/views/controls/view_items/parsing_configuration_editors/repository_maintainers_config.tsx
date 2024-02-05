import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import { RepositoryMaintainer }                      from "../../../../../../../../core/config/models";
import { isEmptyString }                             from "../../../../../../../../core/string_utils";
import logger                                        from "../../../../../../../../logger";

type RepositoryMaintainersConfigProps = {
    maintainers: RepositoryMaintainer[];
    onChange: (maintainers: RepositoryMaintainer[]) => void;
}

type FormItem = {
    key: number;
    name: number;
    maintainerName: string;
    maintainerLink: string;
    maintainerEmail: string;
}

const RepositoryMaintainersConfig: React.FC<RepositoryMaintainersConfigProps> = (props: RepositoryMaintainersConfigProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const initialValue = props.maintainers.map((value, id) => {
        return {
            key: id,
            name: id,
            maintainerName: value.name,
            maintainerLink: value.link,
            maintainerEmail: value.email,
        };
    });

    logger.debug(initialValue, "RepositoryInfoConfiguration, initialValue");

    const onFormSubmit = (values?: any) => {
        if (values === undefined || !("maintainers" in values)) {
            messageApi.warning("Form is not returned list of items");
            logger.debug(values, "RepositoryInfoConfiguration, onFormSubmit, Form is not returned list of items");
            return;
        }

        if (values.maintainers.length > 0) {
            const maintainers = values.maintainers
                                      .map((item: FormItem) => mapFormItemToMaintainer(item))
                                      .filter((maintainer: RepositoryMaintainer) => isMaintainerValuesEmpty(maintainer));

            props.onChange(maintainers.slice());// Slice required to make a copy of array, React expects new object to update
            messageApi.info("Repository Maintainers Values are Changed");
            logger.debug(maintainers, "RepositoryInfoConfiguration, onFormSubmit, maintainers");
            return;
        }

        logger.debug(values, "RepositoryInfoConfiguration, onFormSubmit, No Update happen");
        messageApi.warning("No Update happen");
    };


    return <Card style={{width: "100%"}} title={"Add Maintainers"}>
        {contextHolder}
        <Form form={form} name="maintainers-form" onFinish={onFormSubmit} style={{maxWidth: "100%"}}>
            <Form.List name="maintainers" initialValue={initialValue}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{display: "flex", marginBottom: 8}} align="baseline">

                                <Form.Item{...restField} name={[name, "maintainerName"]} label={"Maintainer Name"}
                                          rules={[{required: true}]}>
                                    <Input placeholder="Maintainer Name"/>
                                </Form.Item>

                                <Form.Item{...restField} name={[name, "maintainerLink"]} label={"Maintainer Link"}
                                          rules={[{required: true}, {type: "url", warningOnly: true}]}>
                                    <Input placeholder="Maintainer Link"/>
                                </Form.Item>

                                <Form.Item{...restField} name={[name, "maintainerEmail"]} label={"Maintainer Email"}
                                          rules={[{required: true}, {type: "email"}]}>
                                    <Input placeholder="Maintainer Email"/>
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add maintainer
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

function mapFormItemToMaintainer(item: FormItem) {
    const maintainer: RepositoryMaintainer = {
        name: item.maintainerName,
        link: item.maintainerLink,
        email: item.maintainerEmail,
    };
    return maintainer;
}

function isMaintainerValuesEmpty(maintainer: RepositoryMaintainer) {
    const hasEmptyName = isEmptyString(maintainer.name);
    const hasEmptyLink = isEmptyString(maintainer.link);
    const hasEmptyEmail = isEmptyString(maintainer.email);

    return !(hasEmptyEmail || hasEmptyName || hasEmptyLink);
}

export default RepositoryMaintainersConfig;