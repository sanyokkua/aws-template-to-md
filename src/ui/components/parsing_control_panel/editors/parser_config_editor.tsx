import React from "react";

import { Button, Card, Form, Input, Row, Switch } from "antd";
import TextView                                   from "../../common/text_view";
import { EditorInput, ParserConfig }              from "../../../../md/writers/customs/models";
import { getCurrentOrDefault }                    from "../../../../utils/utils";

type ParserConfigEditorProps = {
    editorInput: EditorInput<ParserConfig>;
}

const ParserConfigEditor: React.FC<ParserConfigEditorProps> = (props: ParserConfigEditorProps) => {
    const [form] = Form.useForm();

    const onFormSubmit = () => {
        const sfEnabled = form.getFieldValue("stepFunctionSwitch");
        const lambdaEnabled = form.getFieldValue("lambdaSwitch");
        const prefix = form.getFieldValue("prefixText");
        const suffix = form.getFieldValue("suffixText");

        const enableSfDef: boolean = getCurrentOrDefault<boolean>(sfEnabled,
                                                                  props.editorInput.data.enableStepFunctionDefinition);
        const lambdaVars: boolean = getCurrentOrDefault<boolean>(lambdaEnabled,
                                                                 props.editorInput.data.enableStepFunctionDefinition);
        const resourcePrefix: string = getCurrentOrDefault<string>(prefix,
                                                                   props.editorInput.data.templateResourceNamePrefixToRemove);
        const resourceSuffix: string = getCurrentOrDefault<string>(suffix,
                                                                   props.editorInput.data.templateResourceNameSuffixToRemove);

        props.editorInput.onDataChanged({
                                            enableLambdaEnvVarValues: enableSfDef,
                                            enableStepFunctionDefinition: lambdaVars,
                                            templateResourceNamePrefixToRemove: resourcePrefix,
                                            templateResourceNameSuffixToRemove: resourceSuffix,
                                        });

    };

    return <Card style={{width: "100%"}} title={"Configure Parsing of CloudFormation Template"}>
        <Form form={form} name="RepositoryTag-form" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>

            <Form.Item label="Show Step Function Definition" name="stepFunctionSwitch" valuePropName="checked"
                       initialValue={props.editorInput.data.enableStepFunctionDefinition}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Lambda Var Values" name="lambdaSwitch" valuePropName="checked"
                       initialValue={props.editorInput.data.enableLambdaEnvVarValues}>
                <Switch/>
            </Form.Item>

            <Form.Item label="AWS Resource Name Prefix to remove" name="prefixText" rules={[{required: false}]}
                       initialValue={props.editorInput.data.templateResourceNamePrefixToRemove}>
                <Input/>
            </Form.Item>
            <Form.Item label="AWS Resource Name Suffix to remove" name="suffixText" rules={[{required: false}]}
                       initialValue={props.editorInput.data.templateResourceNameSuffixToRemove}>
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
                    checked={props.editorInput.data.enableStepFunctionDefinition}
                    disabled={true}/>
            <Switch checkedChildren="Lambda Env Vars Values Will Be Showed"
                    unCheckedChildren="Lambda Env Vars Values Will NOT Be Showed"
                    checked={props.editorInput.data.enableLambdaEnvVarValues}
                    disabled={true}/>
        </Row>
        <TextView name={"Prefix that will be removed:"}
                  value={props.editorInput.data.templateResourceNamePrefixToRemove}/>
        <TextView name={"Suffix that will be removed:"}
                  value={props.editorInput.data.templateResourceNameSuffixToRemove}/>
    </Card>;
};

export default ParserConfigEditor;