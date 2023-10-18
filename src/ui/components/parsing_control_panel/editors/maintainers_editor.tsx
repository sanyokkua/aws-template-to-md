import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { EditorInput, Maintainer }                   from "../../../../md/writers/customs/models";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import SubmittedFormValues, { FieldMapping }         from "../../common/submited_form";

type MaintainersEditorProps = {
    editorInput: EditorInput<Maintainer[]>;
}

type FormItem = {
    key: number;
    name: number;
    maintainerName: string;
    maintainerLink: string;
    maintainerEmail: string;
}

const MaintainersEditor: React.FC<MaintainersEditorProps> = (props: MaintainersEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
        if (values !== undefined && "maintainers" in values && values.maintainers.length > 0) {
            const maintainers = values.maintainers
                                      .map((item: FormItem) => {
                                          const maintainer: Maintainer = {
                                              name: item.maintainerName,
                                              link: item.maintainerLink,
                                              email: item.maintainerEmail,
                                          };
                                          return maintainer;
                                      })
                                      .filter((maintainer: Maintainer) => {
                                          const hasEmptyName = maintainer.name === undefined || maintainer.name.trim().length === 0;
                                          const hasEmptyLink = maintainer.link === undefined || maintainer.link.trim().length === 0;
                                          const hasEmptyEmail = maintainer.email === undefined || maintainer.email.trim().length === 0;
                                          return !(hasEmptyEmail || hasEmptyName || hasEmptyLink);
                                      });

            props.editorInput.onDataChanged(maintainers.slice());
            messageApi.success(`Submitted: ${JSON.stringify(maintainers, null, 0)}`);
        }
    };

    const initialValue = props.editorInput.data.map((value, id) => {
        return {
            key: id,
            name: id,
            maintainerName: value.name,
            maintainerLink: value.link,
            maintainerEmail: value.email,
        };
    });

    return <Card style={{width: "100%"}} title={"Add Maintainers"}>
        {contextHolder}
        <Form form={form} name="maintainers-form" onFinish={onAddButtonClicked} style={{maxWidth: "100%"}}>

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
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={props.editorInput.data.map(item => {
            const value = `${item.name}, ${item.link}, ${item.email}`;
            const val: FieldMapping = {fieldName: "", fieldValue: value};
            return val;
        })} isList={true}/>
    </Card>;
};

export default MaintainersEditor;