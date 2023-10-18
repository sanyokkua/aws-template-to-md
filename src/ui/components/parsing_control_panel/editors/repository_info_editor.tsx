import React from "react";

import { Button, Card, Form, Input, message } from "antd";
import { EditorInput, RepositoryInfo }        from "../../../../md/writers/customs/models";
import TextArea                               from "antd/es/input/TextArea";
import { getCurrentOrDefault }                from "../../../../utils/utils";
import SubmittedFormValues                    from "../../common/submited_form";

type RepositoryInfoEditorProps = {
    editorInput: EditorInput<RepositoryInfo>;
}
const RepositoryInfoEditor: React.FC<RepositoryInfoEditorProps> = (props: RepositoryInfoEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onAddButtonClicked = (values?: any) => {
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

        const result = {
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
        };
        props.editorInput.onDataChanged(result);
        messageApi.success(`Submitted: ${JSON.stringify(result, null, 0)}`);

    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        {contextHolder}
        <Form form={form} name="repo-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>

            <Form.Item name="repoName" label="Repository Name" initialValue={props.editorInput.data.name}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="description" label="Repository Description"
                       initialValue={props.editorInput.data.description}
                       rules={[{required: true}]}>
                <TextArea rows={4}/>
            </Form.Item>
            <Form.Item name="branchingStrategy" label="Link To Branching Strategy"
                       initialValue={props.editorInput.data.branchingStrategy}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="programmingLang" label="Programming Language"
                       initialValue={props.editorInput.data.mainProgrammingLanguage}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="deploymentDestination" label="Deployment Destination"
                       initialValue={props.editorInput.data.deploymentDestination}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="deploymentTechnology" label="Deployment Technology"
                       initialValue={props.editorInput.data.deploymentTechnology}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="deploymentTechnologyDocs" label="Link To Deployment Technology Docs"
                       initialValue={props.editorInput.data.deploymentTechnologyDocs}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciDocumentation" label="Link To CI/CD Docs"
                       initialValue={props.editorInput.data.ciDocumentation}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciBuildPage" label="Link To CI/CD Build Page"
                       initialValue={props.editorInput.data.ciBuildPage}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="ciDeployPage" label="Link To CI/CD Deployment Page"
                       initialValue={props.editorInput.data.ciDeployPage}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name="linkToCloudForge" label="Link To Cloudforge"
                       initialValue={props.editorInput.data.linkToCloudForge}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={[
            {fieldName: "name", fieldValue: props.editorInput.data.name},
            {fieldName: "description", fieldValue: props.editorInput.data.description},
            {fieldName: "mainProgrammingLanguage", fieldValue: props.editorInput.data.mainProgrammingLanguage},
            {fieldName: "deploymentDestination", fieldValue: props.editorInput.data.deploymentDestination},
            {fieldName: "deploymentTechnology", fieldValue: props.editorInput.data.deploymentTechnology},
            {fieldName: "deploymentTechnologyDocs", fieldValue: props.editorInput.data.deploymentTechnologyDocs},
            {fieldName: "branchingStrategy", fieldValue: props.editorInput.data.branchingStrategy},
            {fieldName: "ciDocumentation", fieldValue: props.editorInput.data.ciDocumentation},
            {fieldName: "ciBuildPage", fieldValue: props.editorInput.data.ciBuildPage},
            {fieldName: "ciDeployPage", fieldValue: props.editorInput.data.ciDeployPage},
            {fieldName: "linkToCloudForge", fieldValue: props.editorInput.data.linkToCloudForge},
        ]}/>
    </Card>;
};

export default RepositoryInfoEditor;