import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { EditorInput, Project, RelatedProjects }     from "../../../../md/writers/customs/models";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import SubmittedFormValues, { FieldMapping }         from "../../common/submited_form";

type RelatedProjectsEditorProps = {
    editorInput: EditorInput<RelatedProjects>;
}

type FormItem = {
    key: number;
    name: number;
    projectName: string;
    projectLink: string;
}

const RelatedProjectsEditor: React.FC<RelatedProjectsEditorProps> = (props: RelatedProjectsEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
        if (values !== undefined && "projects" in values && values.projects.length > 0) {
            const projects = values.projects
                                   .map((item: FormItem) => {
                                       const project: Project = {
                                           projectName: item.projectName,
                                           projectLink: item.projectLink,
                                       };
                                       return project;
                                   })
                                   .filter((project: Project) => {
                                       const hasEmptyName = project.projectName === undefined || project.projectName.trim().length === 0;
                                       const hasEmptyLink = project.projectLink === undefined || project.projectLink.trim().length === 0;
                                       return !(hasEmptyName || hasEmptyLink);
                                   });

            const slice = projects.slice();
            const relatedProjects: RelatedProjects = {projects: slice};
            props.editorInput.onDataChanged(relatedProjects);
            messageApi.success(`Submitted: ${JSON.stringify(projects, null, 0)}`);
        }
    };

    const initialValue = props.editorInput.data.projects.map((value, id) => {
        return {
            key: id,
            name: id,
            projectName: value.projectName,
            projectLink: value.projectLink,
        };
    });

    return <Card style={{width: "100%"}} title={"Add Related Projects"}>
        {contextHolder}
        <Form form={form} name="projects-form" onFinish={onAddButtonClicked} style={{maxWidth: "100%"}}>

            <Form.List name="projects" initialValue={initialValue}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Space key={key} style={{display: "flex", marginBottom: 8}} align="baseline">

                                <Form.Item{...restField} name={[name, "projectName"]} label={"Project Name"}
                                          rules={[{required: true}]}>
                                    <Input placeholder="Project Name"/>
                                </Form.Item>

                                <Form.Item{...restField} name={[name, "projectLink"]} label={"Project Link"}
                                          rules={[{required: true}, {type: "url", warningOnly: true}]}>
                                    <Input placeholder="Project Link"/>
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add Related Project
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={props.editorInput.data.projects.map(item => {
            const value = `${item.projectName}, ${item.projectLink}`;
            const val: FieldMapping = {fieldName: "", fieldValue: value};
            return val;
        })} isList={true}/>
    </Card>;
};

export default RelatedProjectsEditor;