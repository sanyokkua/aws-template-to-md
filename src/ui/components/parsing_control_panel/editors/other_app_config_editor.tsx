import React                                                        from "react";
import { Button, Card, Form, message, Select, SelectProps, Switch } from "antd";
import { EditorInput, OtherAppConfig }                              from "../../../../md/writers/customs/models";
import { AVAILABLE_WRITERS }                                        from "../../../../md/document_parser";
import { getCurrentOrDefault }                                      from "../../../../utils/utils";
import SubmittedFormValues                                          from "../../common/submited_form";

const DEFAULT_WRITERS: string[] = AVAILABLE_WRITERS.slice();
const DEFAULT_OPTIONS: SelectProps["options"] = DEFAULT_WRITERS.map(name => {
    return {
        label: name,
        value: name,
    };
});

export type OtherAppConfigEditorProps = {
    editorInput: EditorInput<OtherAppConfig>;
}

const OtherAppConfigEditor: React.FC<OtherAppConfigEditorProps> = (props: OtherAppConfigEditorProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onFormSubmit = (values?: any) => {
        const showStepFunctionDiagram = form.getFieldValue("showStepFunctionDiagram");
        const showArchitectureDiagramLinkTemplate = form.getFieldValue("showArchitectureDiagramLinkTemplate");
        const writers = form.getFieldValue("selectWriters");
        const showOpenApiStub = form.getFieldValue("showOpenApiStub");
        const showApiGatewayUsageInstructionStub = form.getFieldValue("showApiGatewayUsageInstructionStub");
        const showPostmanStub = form.getFieldValue("showPostmanStub");
        const showPostmanSecretsLink = form.getFieldValue("showPostmanSecretsLink");

        const showStepFunctionDiagramValue = getCurrentOrDefault<boolean>(showStepFunctionDiagram,
                                                                          props.editorInput.data.enableStepFunctionDiagramLinkTemplate);
        const showArchitectureDiagramLinkTemplateValue = getCurrentOrDefault<boolean>(
            showArchitectureDiagramLinkTemplate,
            props.editorInput.data.enableArchitectureDiagramImgLinkTemplate);
        const writersValue = getCurrentOrDefault(writers, props.editorInput.data.selectedWriters);
        const showOpenApiStubValue = getCurrentOrDefault<boolean>(showOpenApiStub,
                                                                  props.editorInput.data.showOpenApiStub);
        const showApiGatewayUsageInstructionStubValue = getCurrentOrDefault<boolean>(showApiGatewayUsageInstructionStub,
                                                                                     props.editorInput.data.showApiGatewayUsageInstructionStub);
        const showPostmanStubValue = getCurrentOrDefault<boolean>(showPostmanStub,
                                                                  props.editorInput.data.showPostmanStub);
        const showPostmanSecretsLinkValue = getCurrentOrDefault<boolean>(showPostmanSecretsLink,
                                                                         props.editorInput.data.showPostmanSecretsLink);

        const selectedWriters = writersValue.map((w: string | { label: string, value: string }) => {
            if (typeof w == "string") {
                return w;
            } else {
                return w.value;
            }
        });

        const result = {
            enableArchitectureDiagramImgLinkTemplate: showArchitectureDiagramLinkTemplateValue,
            enableStepFunctionDiagramLinkTemplate: showStepFunctionDiagramValue,
            selectedWriters: selectedWriters,
            showOpenApiStub: showOpenApiStubValue,
            showApiGatewayUsageInstructionStub: showApiGatewayUsageInstructionStubValue,
            showPostmanStub: showPostmanStubValue,
            showPostmanSecretsLink: showPostmanSecretsLinkValue,
        };
        props.editorInput.onDataChanged(result);
        messageApi.success(`Submitted: ${JSON.stringify(result, null, 0)}`);
    };
    return <Card style={{width: "100%"}} title={"Other Markdown Configurations"}>
        {contextHolder}
        <Form form={form} name="RepositoryTag-form" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>
            <Form.Item label="Show Step Function Diagram Link Template"
                       name="showStepFunctionDiagram"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.enableStepFunctionDiagramLinkTemplate}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Architecture Diagram Link Template"
                       name="showArchitectureDiagramLinkTemplate"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.enableArchitectureDiagramImgLinkTemplate}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show OpenApi Link Stub"
                       name="showOpenApiStub"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.showOpenApiStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Api Gateway Usage Instruction Link Stub"
                       name="showApiGatewayUsageInstructionStub"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.showApiGatewayUsageInstructionStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Postman Collection Link Stub"
                       name="showPostmanStub"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.showPostmanStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Postman Collection Secrets Link Stub"
                       name="showPostmanSecretsLink"
                       valuePropName="checked"
                       initialValue={props.editorInput.data.showPostmanSecretsLink}>
                <Switch/>
            </Form.Item>

            <Form.Item label={"Writers used in parsing process"} name="selectWriters" initialValue={DEFAULT_OPTIONS}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: "100%"}}
                    placeholder="Please select"
                    options={DEFAULT_OPTIONS}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>

        <SubmittedFormValues data={[
            {
                fieldName: "Step Function Diagram Image Link",
                fieldValue: props.editorInput.data.enableStepFunctionDiagramLinkTemplate,
            },
            {
                fieldName: "Architecture Diagram Image Link",
                fieldValue: props.editorInput.data.enableArchitectureDiagramImgLinkTemplate,
            },
            {fieldName: "Hide OpenApi Link", fieldValue: props.editorInput.data.showOpenApiStub},
            {
                fieldName: "Hide Api Gateway Usage Instruction Link",
                fieldValue: props.editorInput.data.showApiGatewayUsageInstructionStub,
            },
            {fieldName: "Hide Postman Collection Link", fieldValue: props.editorInput.data.showPostmanStub},
            {
                fieldName: "Hide Postman Collection Secrets Link",
                fieldValue: props.editorInput.data.showPostmanSecretsLink,
            },
            {fieldName: "Writers", fieldValue: JSON.stringify(props.editorInput.data.selectedWriters, null, 2)},
        ]}/>
    </Card>;
};

export default OtherAppConfigEditor;