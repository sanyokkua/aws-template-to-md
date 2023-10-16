import React from "react";

import { Button, Card, Form, Input, Row } from "antd";
import { EditorInput, RepositoryInfo }    from "../../../../md/writers/customs/models";
import TextArea                           from "antd/es/input/TextArea";
import TextView                           from "../../common/text_view";
import { getCurrentOrDefault }            from "../../../../utils/utils";

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

        const deploymentTechnologyDocs = form.getFieldValue("deploymentTechnologyDocs");
        const branchingStrategy = form.getFieldValue("branchingStrategy");
        const ciDocumentation = form.getFieldValue("ciDocumentation");
        const ciBuildPage = form.getFieldValue("ciBuildPage");
        const ciDeployPage = form.getFieldValue("ciDeployPage");

        const repoNameValue = getCurrentOrDefault(repoName, props.editorInput.data.name);
        const descriptionValue = getCurrentOrDefault(description, props.editorInput.data.description);
        const programmingLangValue = getCurrentOrDefault(programmingLang,
                                                         props.editorInput.data.mainProgrammingLanguage);
        const deploymentDestinationValue = getCurrentOrDefault(deploymentDestination,
                                                               props.editorInput.data.deploymentDestination);
        const deploymentTechnologyValue = getCurrentOrDefault(deploymentTechnology,
                                                              props.editorInput.data.deploymentTechnology);
        const linkToCloudForgeValue = getCurrentOrDefault(linkToCloudForge, props.editorInput.data.linkToCloudForge);
        const deploymentTechnologyDocsValue = getCurrentOrDefault(deploymentTechnologyDocs,
                                                                  props.editorInput.data.deploymentTechnologyDocs);
        const branchingStrategyValue = getCurrentOrDefault(branchingStrategy, props.editorInput.data.branchingStrategy);
        const ciDocumentationValue = getCurrentOrDefault(ciDocumentation, props.editorInput.data.ciDocumentation);
        const ciBuildPageValue = getCurrentOrDefault(ciBuildPage, props.editorInput.data.ciBuildPage);
        const ciDeployPageValue = getCurrentOrDefault(ciDeployPage, props.editorInput.data.ciDeployPage);

        props.editorInput.onDataChanged({
                                            name: repoNameValue,
                                            description: descriptionValue,
                                            mainProgrammingLanguage: programmingLangValue,
                                            deploymentDestination: deploymentDestinationValue,
                                            deploymentTechnology: deploymentTechnologyValue,
                                            linkToCloudForge: linkToCloudForgeValue,
                                            deploymentTechnologyDocs: deploymentTechnologyDocsValue,
                                            branchingStrategy: branchingStrategyValue,
                                            ciDocumentation: ciDocumentationValue,
                                            ciBuildPage: ciBuildPageValue,
                                            ciDeployPage: ciDeployPageValue,
                                        });
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>

        <Form form={form} name="repo-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>

            <Form.Item name="repoName" label="Repository Name" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="description" label="Repository Description" rules={[{required: true}]}>
                <TextArea rows={4}/>
            </Form.Item>
            <Form.Item name="branchingStrategy" label="Link To Branching Strategy" rules={[{required: true}]}>
                <Input/>
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
            <Form.Item name="deploymentTechnologyDocs" label="Link To Deployment Technology Docs"
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciDocumentation" label="Link To CI/CD Docs" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciBuildPage" label="Link To CI/CD Build Page" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciDeployPage" label="Link To CI/CD Deployment Page" rules={[{required: true}]}>
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
        <TextView name={"Link To Branching Strategy"} value={props.editorInput.data.branchingStrategy}/>
        <TextView name={"Programming Language"} value={props.editorInput.data.mainProgrammingLanguage}/>
        <TextView name={"Deployment Destination"} value={props.editorInput.data.deploymentDestination}/>
        <TextView name={"Deployment Technology"} value={props.editorInput.data.deploymentTechnology}/>
        <TextView name={"Link To Deployment Technology Docs"} value={props.editorInput.data.deploymentTechnologyDocs}/>
        <TextView name={"Link To CloudForge"} value={props.editorInput.data.linkToCloudForge}/>
        <TextView name={"Link To CI/CD Docs"} value={props.editorInput.data.ciDocumentation}/>
        <TextView name={"Link To CI/CD Build Page"} value={props.editorInput.data.ciBuildPage}/>
        <TextView name={"Link To CI/CD Deployment Page"} value={props.editorInput.data.ciDeployPage}/>
    </Card>;
};

export default RepositoryInfoEditor;