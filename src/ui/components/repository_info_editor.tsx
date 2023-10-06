import React from "react";

import { Button, Card, Col, Form, Input, Row } from "antd";
import { RepositoryInfo }                      from "../../md/writers/customs/models";

type RepositoryInfoEditorProps = {
    repoInfo: RepositoryInfo;
    onValuesChanged: (repositoryInformation: RepositoryInfo) => void;
}
const RepositoryInfoEditor: React.FC<RepositoryInfoEditorProps> = (props: RepositoryInfoEditorProps) => {
    const [form] = Form.useForm();

    const onAddButtonClicked = () => {
        const programmingLang = form.getFieldValue("programmingLang");
        const deploymentDestination = form.getFieldValue("deploymentDestination");
        const deploymentTechnology = form.getFieldValue("deploymentTechnology");
        const linkToCloudForge = form.getFieldValue("linkToCloudForge");

        const isProgrammingLangNotEmpty = programmingLang !== undefined && programmingLang.length > 0;
        const isDeploymentDestinationNotEmpty = deploymentDestination !== undefined && deploymentDestination.length > 0;
        const isDeploymentTechnologyNotEmpty = deploymentTechnology !== undefined && deploymentTechnology.length > 0;
        const isLinkToCloudForgeNotEmpty = linkToCloudForge !== undefined && linkToCloudForge.length > 0;

        if (isProgrammingLangNotEmpty && isDeploymentDestinationNotEmpty && isDeploymentTechnologyNotEmpty && isLinkToCloudForgeNotEmpty) {
            props.onValuesChanged({
                                      programmingLang: programmingLang,
                                      deploymentDestination: deploymentDestination,
                                      deploymentTechnology: deploymentTechnology,
                                      linkToCloudForge: linkToCloudForge,
                                  });
        }
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        <Form form={form} name="repo-info-form" onFinish={() => onAddButtonClicked()} style={{maxWidth: 600}}>
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
                <Button type="primary" htmlType="submit">Add</Button>
            </Form.Item>
        </Form>
        <Row>
            <Col span={12}>
                Programming Language:
            </Col>
            <Col span={12}>
                {props.repoInfo.programmingLang}
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                Deployment Destination:
            </Col>
            <Col span={12}>
                {props.repoInfo.deploymentDestination}
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                Deployment Technology:
            </Col>
            <Col span={12}>
                {props.repoInfo.deploymentTechnology}
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                Link To CloudForge:
            </Col>
            <Col span={12}>
                {props.repoInfo.linkToCloudForge}
            </Col>
        </Row>
    </Card>;
};

export default RepositoryInfoEditor;