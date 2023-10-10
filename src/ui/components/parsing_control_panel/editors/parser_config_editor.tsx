import React from "react";

import { Button, Card, Form, Input, Row, Switch } from "antd";
import TextView                                   from "../../common/text_view";
import { ParserConfig }                           from "../../../../md/writers/customs/models";

type ParserConfigEditorProps = {
    config: ParserConfig;
    onValuesChanged: (config: ParserConfig) => void;
}
const ParserConfigEditor: React.FC<ParserConfigEditorProps> = (props: ParserConfigEditorProps) => {
    const [form] = Form.useForm();

    const onFormSubmit = () => {
        const sfEnabled = form.getFieldValue("stepFunctionSwitch");
        const lambdaEnabled = form.getFieldValue("lambdaSwitch");
        const prefix = form.getFieldValue("prefixText");
        const suffix = form.getFieldValue("suffixText");

        const isSfEnabledHasValue: boolean = sfEnabled !== undefined;
        const isLambdaEnabledHasValue: boolean = lambdaEnabled !== undefined;
        const isPrefixHasValue: boolean = prefix !== undefined;
        const isSuffixHasValue: boolean = suffix !== undefined;

        if (isSfEnabledHasValue && isLambdaEnabledHasValue && isPrefixHasValue && isSuffixHasValue) {
            props.onValuesChanged({
                                      enableLambdaEnvVarValues: sfEnabled,
                                      enableStepFunctionDefinition: lambdaEnabled,
                                      templateResourceNamePrefixToRemove: prefix,
                                      templateResourceNameSuffixToRemove: suffix,
                                  });
        }
    };

    return <Card style={{width: "100%"}} title={"Configure Parsing of CloudFormation Template"}>
        <Form form={form} name="RepositoryTag-form" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>

            <Form.Item label="Show Step Function Definition" name="stepFunctionSwitch" valuePropName="checked"
                       initialValue={props.config.enableStepFunctionDefinition}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Lambda Var Values" name="lambdaSwitch" valuePropName="checked"
                       initialValue={props.config.enableLambdaEnvVarValues}>
                <Switch/>
            </Form.Item>

            <Form.Item label="Resource Name Prefix to remove" name="prefixText" rules={[{required: false}]}
                       initialValue={props.config.templateResourceNamePrefixToRemove}>
                <Input/>
            </Form.Item>
            <Form.Item label="Resource Name Suffix to remove" name="suffixText" rules={[{required: false}]}
                       initialValue={props.config.templateResourceNameSuffixToRemove}>
                <Input/>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <Row><h3>Confirmed Values:</h3></Row>
        <Row>
            <Switch checkedChildren="Step Function Definition Will Be Showed"
                    unCheckedChildren="Step Function Definition Will NOT Be Showed"
                    checked={props.config.enableStepFunctionDefinition}
                    disabled={true}/>
            <Switch checkedChildren="Lambda Env Vars Values Will Be Showed"
                    unCheckedChildren="Lambda Env Vars Values Will NOT Be Showed"
                    checked={props.config.enableLambdaEnvVarValues}
                    disabled={true}/>
        </Row>
        <TextView name={"Prefix that will be removed:"} value={props.config.templateResourceNamePrefixToRemove}/>
        <TextView name={"Suffix that will be removed:"} value={props.config.templateResourceNameSuffixToRemove}/>
    </Card>;
};

export default ParserConfigEditor;