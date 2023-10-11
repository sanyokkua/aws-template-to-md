import React from "react";

import { Button, Card, Form, Input, Row } from "antd";
import { EditorInput, RepositoryInfo }    from "../../../../md/writers/customs/models";
import TextArea                           from "antd/es/input/TextArea";
import TextView                           from "../../common/text_view";

type RepositoryInfoEditorProps = {
    editorInput: EditorInput<RepositoryInfo>;
}
const RepositoryInfoEditor: React.FC<RepositoryInfoEditorProps> = (props: RepositoryInfoEditorProps) => {
    const [form] = Form.useForm();

    const onAddButtonClicked = () => {
        const repoName = form.getFieldValue("repoName");
        const description = form.getFieldValue("description");

        const programmingLang = form.getFieldValue("programmingLang");
        const deploymentDestination = form.getFieldValue("deploymentDestination");
        const deploymentTechnology = form.getFieldValue("deploymentTechnology");
        const linkToCloudForge = form.getFieldValue("linkToCloudForge");

        const isRepoNameNotEmpty = repoName !== undefined && repoName.length > 0;
        const isDescriptionNotEmpty = description !== undefined && description.length > 0;
        const isProgrammingLangNotEmpty = programmingLang !== undefined && programmingLang.length > 0;
        const isDeploymentDestinationNotEmpty = deploymentDestination !== undefined && deploymentDestination.length > 0;
        const isDeploymentTechnologyNotEmpty = deploymentTechnology !== undefined && deploymentTechnology.length > 0;
        const isLinkToCloudForgeNotEmpty = linkToCloudForge !== undefined && linkToCloudForge.length > 0;

        const isDataValid = isRepoNameNotEmpty &&
            isDescriptionNotEmpty &&
            isProgrammingLangNotEmpty &&
            isDeploymentDestinationNotEmpty &&
            isDeploymentTechnologyNotEmpty &&
            isLinkToCloudForgeNotEmpty;

        if (isDataValid) {
            props.editorInput.onDataChanged({
                                                name: repoName,
                                                description: description,
                                                mainProgrammingLanguage: programmingLang,
                                                deploymentDestination: deploymentDestination,
                                                deploymentTechnology: deploymentTechnology,
                                                linkToCloudForge: linkToCloudForge,
                                            });
        }
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>

        <Form form={form} name="repo-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
            <Form.Item name="repoName" label="Repository Name" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="description" label="Repository Description" rules={[{required: true}]}>
                <TextArea rows={4}/>
            </Form.Item>
            <Form.Item name="programmingLang" label="Programming Language" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="deploymentDestination" label="Deployment Destination" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="deploymentTechnology" label="Deployment Technology" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="linkToCloudForge" label="Link To Cloudforge" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <Row><h3>Confirmed Values:</h3></Row>
        <TextView name={"Name"} value={props.editorInput.data.name}/>
        <TextView name={"Description"} value={props.editorInput.data.description} isTextArea={true}/>
        <TextView name={"Programming Language"} value={props.editorInput.data.mainProgrammingLanguage}/>
        <TextView name={"Deployment Destination"} value={props.editorInput.data.deploymentDestination}/>
        <TextView name={"Deployment Technology"} value={props.editorInput.data.deploymentTechnology}/>
        <TextView name={"Link To CloudForge"} value={props.editorInput.data.linkToCloudForge}/>
    </Card>;
};

export default RepositoryInfoEditor;