import React from "react";

import { Button, Card, Form, Input, message } from "antd";
import TextArea                               from "antd/es/input/TextArea";
import { RepositoryInfo }                     from "../../../../../../../../core/config/models";
import logger                                 from "../../../../../../../../logger";

type RepositoryInfoConfigurationProps = {
    repositoryInfo: RepositoryInfo;
    onChange: (repositoryInfo: RepositoryInfo) => void;
}
const RepositoryInfoConfiguration: React.FC<RepositoryInfoConfigurationProps> = (props: RepositoryInfoConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const repositoryName: string = props.repositoryInfo?.repositoryName ?? "";
    const repositoryDescription: string = props.repositoryInfo?.repositoryDescription ?? "";
    const branchingStrategy: string = props.repositoryInfo?.branchingStrategy ?? "";
    const programmingLang: string = props.repositoryInfo?.programmingLang ?? "";
    const programmingLangDoc: string = props.repositoryInfo?.programmingLangDoc ?? "";
    const deploymentDestination: string = props.repositoryInfo?.deploymentDestination ?? "";
    const deploymentTechnology: string = props.repositoryInfo?.deploymentTechnology ?? "";
    const deploymentTechnologyDocs: string = props.repositoryInfo?.deploymentTechnologyDocs ?? "";
    const linkToCloudForge: string = props.repositoryInfo?.linkToCloudForge ?? "";
    const ciCdTechnology: string = props.repositoryInfo?.ciCdTechnology ?? "";
    const ciCdDocumentation: string = props.repositoryInfo?.ciCdDocumentation ?? "";
    const ciCdBuildPage: string = props.repositoryInfo?.ciCdBuildPage ?? "";
    const ciCdDeployPage: string = props.repositoryInfo?.ciCdDeployPage ?? "";

    logger.debug({
                     repositoryName,
                     repositoryDescription,
                     branchingStrategy,
                     programmingLang,
                     programmingLangDoc,
                     deploymentDestination,
                     deploymentTechnology,
                     deploymentTechnologyDocs,
                     linkToCloudForge,
                     ciCdTechnology,
                     ciCdDocumentation,
                     ciCdBuildPage,
                     ciCdDeployPage,
                 }, "RepositoryInfoConfiguration, initialValues");

    const onFormSubmit = () => {
        const repositoryNameValue = form.getFieldValue("repoName") ?? repositoryName;
        const repositoryDescriptionValue = form.getFieldValue("description") ?? repositoryDescription;
        const branchingStrategyValue = form.getFieldValue("branchingStrategy") ?? branchingStrategy;
        const programmingLangValue = form.getFieldValue("programmingLang") ?? programmingLang;
        const programmingLangDocsValue = form.getFieldValue("programmingLangDocs") ?? programmingLangDoc;
        const deploymentDestinationValue = form.getFieldValue("deploymentDestination") ?? deploymentDestination;
        const deploymentTechnologyValue = form.getFieldValue("deploymentTechnology") ?? deploymentTechnology;
        const deploymentTechnologyDocsValue = form.getFieldValue("deploymentTechnologyDocs") ?? deploymentTechnologyDocs;
        const linkToCloudForgeValue = form.getFieldValue("linkToCloudForge") ?? linkToCloudForge;
        const ciCdTechnologyValue = form.getFieldValue("ciCdTechnology") ?? ciCdTechnology;
        const ciCdDocumentationValue = form.getFieldValue("ciCdDocumentation") ?? ciCdDocumentation;
        const ciBuildPageValue = form.getFieldValue("ciBuildPage") ?? ciCdBuildPage;
        const ciDeployPageValue = form.getFieldValue("ciDeployPage") ?? ciCdDeployPage;

        const result: RepositoryInfo = {
            repositoryName: repositoryNameValue,
            repositoryDescription: repositoryDescriptionValue,
            branchingStrategy: branchingStrategyValue,
            programmingLang: programmingLangValue,
            programmingLangDoc: programmingLangDocsValue,
            deploymentDestination: deploymentDestinationValue,
            deploymentTechnology: deploymentTechnologyValue,
            deploymentTechnologyDocs: deploymentTechnologyDocsValue,
            linkToCloudForge: linkToCloudForgeValue,
            ciCdTechnology: ciCdTechnologyValue,
            ciCdDocumentation: ciCdDocumentationValue,
            ciCdBuildPage: ciBuildPageValue,
            ciCdDeployPage: ciDeployPageValue,
        };
        props.onChange(result);
        messageApi.info("Repository Information Values are Changed");
        logger.debug(result, "RepositoryInfoConfiguration, onFormSubmit");
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        {contextHolder}
        <Form form={form} name="RepositoryInformationForm" onFinish={() => onFormSubmit()}
              style={{maxWidth: 600}}>

            <Form.Item name="repoName" label="Repository Name" initialValue={repositoryName}
                       rules={[{required: false}]}>
                <Input placeholder={"Repository Name"}/>
            </Form.Item>
            <Form.Item name="description" label="Repository Description" initialValue={repositoryDescription}
                       rules={[{required: false}]}>
                <TextArea rows={4}/>
            </Form.Item>
            <Form.Item name="branchingStrategy" label="Link To Branching Strategy" initialValue={branchingStrategy}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url to Branching strategy"}/>
            </Form.Item>
            <Form.Item name="programmingLang" label="Programming Language" initialValue={programmingLang}
                       rules={[{required: false}]}>
                <Input placeholder={"Name of the Programming Language"}/>
            </Form.Item>
            <Form.Item name="programmingLangDocs" label="Programming Language Docs URL"
                       initialValue={programmingLangDoc} rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url with Programming Language Docs"}/>
            </Form.Item>
            <Form.Item name="deploymentDestination" label="Deployment Destination" initialValue={deploymentDestination}
                       rules={[{required: false}]}>
                <Input placeholder={"Name of Service where app will be deployed"}/>
            </Form.Item>
            <Form.Item name="deploymentTechnology" label="Deployment Technology" initialValue={deploymentTechnology}
                       rules={[{required: false}]}>
                <Input placeholder={"Technology that will be used to deploy like CDK, Docker, etc"}/>
            </Form.Item>
            <Form.Item name="deploymentTechnologyDocs" label="Link To Deployment Technology Docs"
                       initialValue={deploymentTechnologyDocs}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url with deployment technology docs"}/>
            </Form.Item>
            <Form.Item name="ciCdTechnology" label="CI/CD Technology" initialValue={ciCdTechnology}
                       rules={[{required: false}]}>
                <Input placeholder={"Name of the CI/CD tool like Jenkins, Bamboo, Github Actions, etc"}/>
            </Form.Item>
            <Form.Item name="ciCdDocumentation" label="Link To CI/CD Docs" initialValue={ciCdDocumentation}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url to CI/CD tool docs"}/>
            </Form.Item>
            <Form.Item name="ciBuildPage" label="Link To CI/CD Build Page" initialValue={ciCdBuildPage}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url of the page with app Build"}/>
            </Form.Item>
            <Form.Item name="ciDeployPage" label="Link To CI/CD Deployment Page" initialValue={ciCdDeployPage}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url of the page with app Deployments"}/>
            </Form.Item>
            <Form.Item name="linkToCloudForge" label="Link To Cloudforge" initialValue={linkToCloudForge}
                       rules={[{required: false}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Link to the CloudForge project or other root project"}/>
            </Form.Item>

            <Form.Item>
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

export default RepositoryInfoConfiguration;