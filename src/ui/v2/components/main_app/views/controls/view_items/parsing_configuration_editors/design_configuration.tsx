import React from "react";

import { Button, Card, Form, Input, message } from "antd";
import { DesignInformation }                  from "../../../../../../../../core/config/models";
import logger                                 from "../../../../../../../../logger";

type DesignConfigurationProps = {
    designInfo: DesignInformation;
    onChange: (designInfo: DesignInformation) => void;
}
const DesignConfiguration: React.FC<DesignConfigurationProps> = (props: DesignConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const solutionDiagramUrl = props.designInfo.solutionDiagramUrl ?? "";
    const solutionDiagramImageUrl = props.designInfo.solutionDiagramImageUrl ?? "";

    logger.debug({solutionDiagramUrl, solutionDiagramImageUrl}, "DesignConfiguration, initialValues");

    const onFormSubmit = () => {
        const linkToTheSolutionDiagram = form.getFieldValue("linkToTheSolutionDiagram") ?? solutionDiagramUrl;
        const linkToTheDiagramImage = form.getFieldValue("linkToTheDiagramImage") ?? solutionDiagramImageUrl;

        const result: DesignInformation = {
            solutionDiagramUrl: linkToTheSolutionDiagram,
            solutionDiagramImageUrl: linkToTheDiagramImage,
        };

        props.onChange(result);
        messageApi.info("Project Design Information Values are Changed");
        logger.debug(result, "DesignConfiguration, onFormSubmit");
    };

    return <Card style={{width: "100%"}} title={"Add Repository Information"}>
        {contextHolder}
        <Form form={form} name="design-info-form" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>
            <Form.Item name="linkToTheSolutionDiagram" label="Link to the solution diagram"
                       initialValue={solutionDiagramUrl}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url to the Solution Diagram of the artifact"}/>
            </Form.Item>
            <Form.Item name="linkToTheDiagramImage" label="Link to the diagram image"
                       initialValue={solutionDiagramImageUrl}
                       rules={[{required: true}, {type: "url", warningOnly: true}]}>
                <Input placeholder={"Url to the Solution Diagram Image of the artifact"}/>
            </Form.Item>
            <Form.Item>
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

    </Card>;
};

export default DesignConfiguration;