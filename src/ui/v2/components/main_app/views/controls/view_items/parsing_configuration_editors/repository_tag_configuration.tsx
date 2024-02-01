import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RepositoryTag }                     from "../../../../../../../../core/config/models";
import { isEmptyString }                     from "../../../../../../../../core/string_utils";
import logger from "../../../../../../../../logger";

type RepositoryTagsConfigurationProps = {
    repositoryTags: RepositoryTag[];
    onChange: (repositoryTags: RepositoryTag[]) => void;
}

type FormItem = {
    key: number;
    name: number;
    repositoryTagText: string;
    repositoryTagLink: string;
    repositoryTagMarkdown: string;
}


const RepositoryTagsConfiguration: React.FC<RepositoryTagsConfigurationProps> = (props: RepositoryTagsConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const initialValue = props.repositoryTags.map((value, id) => {
        return {
            key: id,
            name: id,
            repositoryTagText: value.text,
            repositoryTagLink: value.imgUrl,
            repositoryTagMarkdown: value.imgMd,
        };
    });

    logger.debug(initialValue, "RepositoryTagsConfiguration, initialValue");

    const onFormSubmit = (values?: any) => {
        if (values === undefined || !("tags" in values)) {
            messageApi.warning("Form is not returned list of items");
            logger.debug(values, "RepositoryTagsConfiguration, onFormSubmit, Form is not returned list of items");
            return;
        }

        if (values.tags.length > 0) {
            const tags = values.tags
                               .map((item: FormItem) => mapFormItemToRepositoryTag(item))
                               .filter((tag: RepositoryTag) => hasAtLeastLinkOrMd(tag))
                               .map((tag: RepositoryTag) => mapRepositoryTagsThatHasOnlyMarkdown(tag));

            props.onChange(tags.slice());// Slice required to make a copy of array, React expects new object to update
            messageApi.info("Repository Tags Values are Changed");
            logger.debug(tags, "RepositoryTagsConfiguration, onFormSubmit, tags");
            return;
        }

        logger.debug(values, "RepositoryTagsConfiguration, onFormSubmit, No Update happen");
        messageApi.warning("No Update happen");
    };


    return <Card style={{width: "100%"}} title={"Add Repository Tags"}>
        {contextHolder}
        <Form form={form} name="RepositoryTasgForm" onFinish={onFormSubmit} style={{maxWidth: "100%"}}
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
                                          label={"Or Tag Markdown"} rules={[{required: false}]}>
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
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

function mapFormItemToRepositoryTag(item: FormItem) {
    const repositoryTag: RepositoryTag = {
        text: item.repositoryTagText,
        imgUrl: item.repositoryTagLink,
        imgMd: item.repositoryTagMarkdown,
    };
    return repositoryTag;
}

function hasAtLeastLinkOrMd(tag: RepositoryTag) {
    const isMarkdownEmpty = isEmptyString(tag.imgMd);
    const isLinkAndTextEmpty = (isEmptyString(tag.imgUrl)) && (isEmptyString(tag.text));

    return !(isMarkdownEmpty && isLinkAndTextEmpty);
}

function mapRepositoryTagsThatHasOnlyMarkdown(tag: RepositoryTag) {
    const isMarkdownEmpty = isEmptyString(tag.imgMd);
    const isLinkAndTextEmpty = (isEmptyString(tag.imgUrl)) && (isEmptyString(tag.text));

    if (isLinkAndTextEmpty && !isMarkdownEmpty && tag.imgMd !== undefined) {
        const res: string[] = tag.imgMd.split("[");
        tag.imgUrl = res[1].slice(0, -1);
    }
    return tag;
}

export default RepositoryTagsConfiguration;