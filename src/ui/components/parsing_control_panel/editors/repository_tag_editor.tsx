import React from "react";

import { Button, Card, Col, Form, Image, Input, List, Row } from "antd";
import { EditorInput, RepositoryTag }                       from "../../../../md/writers/customs/models";

type RepositoryTagsEditorProps = {
    editorInput: EditorInput<RepositoryTag[]>;
}
const RepositoryTagsEditor: React.FC<RepositoryTagsEditorProps> = (props: RepositoryTagsEditorProps) => {
    const [form] = Form.useForm();

    const onRemoveItem = (item: RepositoryTag) => {
        const currentArray = props.editorInput.data.slice();
        const result = currentArray.filter(curItem => !(curItem.text === item.text && curItem.imgLink === item.imgLink));
        props.editorInput.onDataChanged(result);
    };

    const onAddButtonClicked = () => {
        const text: string | undefined = form.getFieldValue("RepositoryTagText");
        const link: string | undefined = form.getFieldValue("RepositoryTagLink");
        const rawMarkdown: string | undefined = form.getFieldValue("rawMarkdown");

        const isTextFieldNotEmpty = text !== undefined && text.length > 0;
        const isLinkFieldIsNotEmpty = link !== undefined && link.length > 0;
        const isRawMarkdownFieldIsNotEmpty = rawMarkdown !== undefined && rawMarkdown.length > 0;

        if (isTextFieldNotEmpty && isLinkFieldIsNotEmpty || isRawMarkdownFieldIsNotEmpty) {
            const currentArray = props.editorInput.data.slice();
            const found = currentArray.find(curItem => {
                if (curItem.linkMd !== undefined) {
                    return curItem.linkMd === rawMarkdown;
                } else {
                    return curItem.text === text && curItem.imgLink === link;
                }
            });

            if (!found) {
                let parsedLink: string = "";

                if (link !== undefined && link.length > 0) {
                    parsedLink = link;
                } else if ((link === undefined || link.length === 0) && rawMarkdown !== undefined && rawMarkdown.length > 0) {
                    const res = rawMarkdown.split("[");
                    parsedLink = res[1].slice(0, -1);
                } else {
                    parsedLink = "";
                }

                const tag: RepositoryTag = {
                    text: text,
                    imgLink: parsedLink,
                    linkMd: rawMarkdown,
                };
                currentArray.push(tag);
                props.editorInput.onDataChanged(currentArray);
            }
        }
    };

    return <Card style={{width: "100%"}} title={"Add RepositoryTags"}>
        <Form form={form} name="RepositoryTag-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="RepositoryTagText" label="RepositoryTag Text" rules={[{required: false}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="RepositoryTagLink" label="RepositoryTag Link" rules={[{required: false}]}>
                <Input/>
            </Form.Item>
            <h3>Or</h3>
            <Form.Item name="rawMarkdown" label="RepositoryTag Link Markdown" rules={[{required: false}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <Row><h3>Confirmed Values:</h3></Row>
        <Row>
            <Col span={24}>
                <List itemLayout="horizontal" dataSource={props.editorInput.data}
                      renderItem={(item) => (
                          <List.Item actions={[<a key="remove" onClick={() => onRemoveItem(item)}>remove</a>]}>
                              {item.text !== undefined && item.imgLink !== undefined && item.text.length > 0 && item.imgLink.length > 0 ?
                               `${item.text}, ${item.imgLink}` :
                               item.linkMd}
                              <Image width={100} src={item.imgLink}/>
                          </List.Item>
                      )}
                />
            </Col>
        </Row>
    </Card>;
};

export default RepositoryTagsEditor;