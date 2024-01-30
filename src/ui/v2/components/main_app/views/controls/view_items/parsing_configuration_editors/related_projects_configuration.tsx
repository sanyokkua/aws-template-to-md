import React from "react";

import { Button, Card, Form, Input, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined }         from "@ant-design/icons";
import { Project }                                   from "../../../../../../../../core/config/models";
import { isEmptyString }                             from "../../../../../../../../core/string_utils";

type RelatedProjectsConfigurationProps = {
    relatedProjects: Project[];
    onChange: (relatedProjects: Project[]) => void;
}

type FormItem = {
    key: number;
    name: number;
    projectName: string;
    projectLink: string;
}


const RelatedProjectsConfiguration: React.FC<RelatedProjectsConfigurationProps> = (props: RelatedProjectsConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const initialValue = props.relatedProjects.map((value, id) => {
        return {
            key: id,
            name: id,
            projectName: value.projectName,
            projectLink: value.projectLink,
        };
    });

    const onFormSubmit = (values?: any) => {
        if (values === undefined || !("projects" in values)) {
            messageApi.warning("Form is not returned list of items");
            return;
        }

        if (values.projects.length > 0) {
            const projects = values.projects
                                   .map((item: FormItem) => mapFormItemToRelatedProject(item))
                                   .filter((project: Project) => isProjectEmpty(project));

            props.onChange(projects.slice());// Slice required to make a copy of array, React expects new object to update
            messageApi.info("Related Projects Values are Changed");
            console.log(projects);
            return;
        }

        messageApi.warning("No Update happen");
    };

    return <Card style={{width: "100%"}} title={"Add Related Projects"}>
        {contextHolder}
        <Form form={form} name="RelatedProjectsForm" onFinish={onFormSubmit} style={{maxWidth: "100%"}}>

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
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

function mapFormItemToRelatedProject(item: FormItem) {
    const project: Project = {
        projectName: item.projectName,
        projectLink: item.projectLink,
    };
    return project;
}

function isProjectEmpty(project: Project) {
    const hasEmptyName = isEmptyString(project.projectName);
    const hasEmptyLink = isEmptyString(project.projectLink);

    return !(hasEmptyName || hasEmptyLink);
}

export default RelatedProjectsConfiguration;