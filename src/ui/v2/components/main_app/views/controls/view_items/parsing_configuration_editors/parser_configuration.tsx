import React from "react";

import { Button, Card, Form, Input, message } from "antd";
import { ParserConfig }                       from "../../../../../../../../core/config/models";
import logger                                 from "../../../../../../../../logger";

type ParserConfigurationProps = {
    config: ParserConfig;
    onChange: (config: ParserConfig) => void;
}

const ParserConfiguration: React.FC<ParserConfigurationProps> = (props: ParserConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const currentPrefixValue = props.config?.prefixToRemove ?? "";
    const currentSuffixValue = props.config?.suffixToRemove ?? "";
    const currentOriginalValue = props.config?.replaceOriginalValue ?? "";
    const currentReplaceValue = props.config?.replaceToValue ?? "";

    logger.debug({currentPrefixValue, currentSuffixValue, currentOriginalValue, currentReplaceValue},
                 "ParserConfiguration, initialValues");

    const onFormSubmit = () => {
        const prefix = form.getFieldValue("prefixText") ?? currentPrefixValue;
        const suffix = form.getFieldValue("suffixText") ?? currentSuffixValue;
        const originalValue = form.getFieldValue("replaceOriginalValue") ?? currentOriginalValue;
        const newValue = form.getFieldValue("replaceNewValue") ?? currentReplaceValue;

        const parserConf: ParserConfig = {
            prefixToRemove: prefix,
            suffixToRemove: suffix,
            replaceOriginalValue: originalValue,
            replaceToValue: newValue,
        };

        messageApi.info("Parser Configuration Values are Changed");
        props.onChange(parserConf);
        logger.debug(parserConf, "ParserConfiguration, onFormSubmit");
    };

    return <Card style={{width: "100%"}} title={"Configure Parsing of CloudFormation Template"}>
        {contextHolder}
        <Form form={form} name="ParserConfigurationForm" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>

            <Form.Item label="AWS Resource Name Prefix to remove" name="prefixText" initialValue={currentPrefixValue}
                       rules={[{required: false}]}>
                <Input placeholder="Prefix to remove"/>
            </Form.Item>

            <Form.Item label="AWS Resource Name Suffix to remove" name="suffixText" initialValue={currentSuffixValue}
                       rules={[{required: false}]}>
                <Input placeholder="Suffix to remove"/>
            </Form.Item>

            <Form.Item label="AWS Resource Name Replace Value" rules={[{required: false}]}>
                <Form.Item name="replaceOriginalValue" initialValue={currentOriginalValue} rules={[{required: false}]}>
                    <Input placeholder="Original value to replace"/>
                </Form.Item>
                <Form.Item name="replaceNewValue" initialValue={currentReplaceValue} rules={[{required: false}]}>
                    <Input placeholder="Value that will be used for replacement"/>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

export default ParserConfiguration;