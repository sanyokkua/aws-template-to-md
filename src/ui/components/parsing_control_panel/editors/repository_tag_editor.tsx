import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { EditorInput, RepositoryTag }                from "../../../../md/writers/customs/models";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import SubmittedFormValues, { FieldMapping }         from "../../common/submited_form";
import { isEmptyString }                             from "../../../../utils/utils";

type RepositoryTagsEditorProps = {
    editorInput: EditorInput<RepositoryTag[]>;
}

type FormItem = {
    key: number;
    name: number;
    repositoryTagText: string;
    repositoryTagLink: string;
    repositoryTagMarkdown: string;
}

const RepositoryTagsEditor: React.FC<RepositoryTagsEditorProps> = (props: RepositoryTagsEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
        if (values !== undefined && "tags" in values && values.tags.length > 0) {
            const tags = values.tags
                               .map((item: FormItem) => {
                                   const tag: RepositoryTag = {
                                       text: item.repositoryTagText,
                                       imgLink: item.repositoryTagLink,
                                       linkMd: item.repositoryTagMarkdown,
                                   };
                                   return tag;
                               })
                               .filter((tag: RepositoryTag) => {
                                   const isMarkdownEmpty = isEmptyString(tag.linkMd);
                                   const isLinkAndTextEmpty = (isEmptyString(tag.imgLink)) && (isEmptyString(tag.text));

                                   return !(isMarkdownEmpty && isLinkAndTextEmpty);
                               })
                               .map((tag: RepositoryTag) => {
                                   const isMarkdownEmpty = isEmptyString(tag.linkMd);
                                   const isLinkAndTextEmpty = (isEmptyString(tag.imgLink)) && (isEmptyString(tag.text));

                                   if (isLinkAndTextEmpty && !isMarkdownEmpty && tag.linkMd !== undefined) {
                                       const res: string[] = tag.linkMd.split("[");
                                       tag.imgLink = res[1].slice(0, -1);
                                   }
                                   return tag;
                               });
            props.editorInput.onDataChanged(tags.slice());
            messageApi.success(`Submitted: ${JSON.stringify(tags, null, 0)}`);
        }
    };

    const initialValue = props.editorInput.data.map((value, id) => {
        return {
            key: id,
            name: id,
            repositoryTagText: value.text,
            repositoryTagLink: value.imgLink,
            repositoryTagMarkdown: value.linkMd,
        };
    });

    return <Card style={{width: "100%"}} title={"Add RepositoryTags"}>
        {contextHolder}
        <Form form={form} name="RepositoryTag-form" onFinish={onAddButtonClicked} style={{maxWidth: "100%"}}
              autoComplete="on">

            <Form.List name="tags" initialValue={initialValue}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{display: "flex", marginBottom: 8}} align="baseline">

                                <Form.Item{...restField} name={[name, "repositoryTagText"]} label={"Tag Text"}
                                          rules={[{required: false}]}>
                                    <Input placeholder="Tag Text"/>
                                </Form.Item>

                                <Form.Item{...restField} name={[name, "repositoryTagLink"]} label={"Tag URL"}
                                          rules={[{required: false}, {type: "url", warningOnly: true}]}>
                                    <Input placeholder="Tag URL"/>
                                </Form.Item>

                                <Form.Item{...restField} name={[name, "repositoryTagMarkdown"]}
                                          label={"Or Tag Markdown"}
                                          rules={[{required: false}]}>
                                    <Input placeholder="Tag MD"/>
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add tag
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
            const value = `${item.text}, ${item.imgLink}, ${item.linkMd}`;
            const val: FieldMapping = {fieldName: "", fieldValue: value};
            return val;
        })} isList={true}/>
    </Card>;
};

export default RepositoryTagsEditor;