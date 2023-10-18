import React from "react";

import { Button, Card, Form, Input, message, Switch } from "antd";
import { EditorInput, ParserConfig }                  from "../../../../md/writers/customs/models";
import { getCurrentOrDefault }                        from "../../../../utils/utils";

type ParserConfigEditorProps = {
    editorInput: EditorInput<ParserConfig>;
}

const ParserConfigEditor: React.FC<ParserConfigEditorProps> = (props: ParserConfigEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onFormSubmit = (values?: any) => {
        const sfEnabled = form.getFieldValue("stepFunctionSwitch");
        const lambdaEnabled = form.getFieldValue("lambdaSwitch");
        const dynamoDbEx = form.getFieldValue("dynamoDbEx");
        const prefix = form.getFieldValue("prefixText");
        const suffix = form.getFieldValue("suffixText");

        const enableSfDef: boolean = getCurrentOrDefault<boolean>(sfEnabled,
                                                                  props.editorInput.data.enableStepFunctionDefinition);
        const lambdaVars: boolean = getCurrentOrDefault<boolean>(lambdaEnabled,
                                                                 props.editorInput.data.enableStepFunctionDefinition);
        const dynamoDbExVal: boolean = getCurrentOrDefault<boolean>(dynamoDbEx,
                                                                    props.editorInput.data.enableDynamoDbExampleStubs);
        const resourcePrefix: string = getCurrentOrDefault<string>(prefix,
                                                                   props.editorInput.data.templateResourceNamePrefixToRemove);
        const resourceSuffix: string = getCurrentOrDefault<string>(suffix,
                                                                   props.editorInput.data.templateResourceNameSuffixToRemove);

        const result = {
            enableLambdaEnvVarValues: enableSfDef,
            enableStepFunctionDefinition: lambdaVars,
            enableDynamoDbExampleStubs: dynamoDbExVal,
            templateResourceNamePrefixToRemove: resourcePrefix,
            templateResourceNameSuffixToRemove: resourceSuffix,
        };
        props.editorInput.onDataChanged(result);
        messageApi.success(`Submitted: ${JSON.stringify(result, null, 0)}`);

    };

    return <Card style={{width: "100%"}} title={"Configure Parsing of CloudFormation Template"}>
        {contextHolder}
        <Form form={form} name="RepositoryTag-form" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>

            <Form.Item label="Show Step Function Definition" name="stepFunctionSwitch" valuePropName="checked"
                       initialValue={props.editorInput.data.enableStepFunctionDefinition}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Lambda Var Values" name="lambdaSwitch" valuePropName="checked"
                       initialValue={props.editorInput.data.enableLambdaEnvVarValues}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show DynamoDB examples" name="dynamoDbEx" valuePropName="checked"
                       initialValue={props.editorInput.data.enableDynamoDbExampleStubs}>
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


        <h3>Submitted values:</h3>
        <div>
            <table>
                <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>Step Function Definition Will Be Showed</td>
                    <td>{props.editorInput.data.enableStepFunctionDefinition}</td>
                </tr>
                <tr>
                    <td>Lambda Env Vars Values Will Be Showed</td>
                    <td>{props.editorInput.data.enableLambdaEnvVarValues}</td>
                </tr>
                <tr>
                    <td>DynamoDB Example stub Will Be Showed</td>
                    <td>{props.editorInput.data.enableDynamoDbExampleStubs}</td>
                </tr>
                <tr>
                    <td>Prefix that will be removed</td>
                    <td>{props.editorInput.data.templateResourceNamePrefixToRemove}</td>
                </tr>
                <tr>
                    <td>Suffix that will be removed</td>
                    <td>{props.editorInput.data.templateResourceNameSuffixToRemove}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </Card>;
};

export default ParserConfigEditor;