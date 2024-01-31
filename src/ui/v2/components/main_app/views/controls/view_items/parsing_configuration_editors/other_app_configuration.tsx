import React                                                        from "react";
import { Button, Card, Form, message, Select, SelectProps, Switch } from "antd";
import { OtherAppConfiguration }                                    from "../../../../../../../../core/config/models";
import {
    AVAILABLE_MARKDOWN_DOC_SECTIONS,
}                                                                   from "../../../../../../../../core/config/constatns";

function mapValuesToSelectProps(values: string[]): SelectProps["options"] {
    return values.slice().map(name => {
        return {
            label: name,
            value: name,
        };
    });
}

const DEFAULT_OPTIONS: SelectProps["options"] = mapValuesToSelectProps(AVAILABLE_MARKDOWN_DOC_SECTIONS);

export type OtherAppConfigurationProps = {
    config: OtherAppConfiguration;
    onChange: (config: OtherAppConfiguration) => void;
}

const OtherAppConfigurations: React.FC<OtherAppConfigurationProps> = (props: OtherAppConfigurationProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const showStepFunctionDefinition: boolean = props.config.showStepFunctionDefinition ?? "";
    const showStepFunctionSteps: boolean = props.config.showStepFunctionSteps ?? "";
    const showLambdaVars: boolean = props.config.showLambdaVars ?? "";
    const showLambdaVarsValues: boolean = props.config.showLambdaVarsValues ?? "";
    const showApiGatewayEndpointMaintainerColumn: boolean = props.config.showApiGatewayEndpointMaintainerColumn ?? "";
    const showApiGatewayEndpointDocsLinkColumn: boolean = props.config.showApiGatewayEndpointDocsLinkColumn ?? "";
    const addDynamoDbExamplesStub: boolean = props.config.addDynamoDbExamplesStub ?? "";
    const addDesignLinkStub: boolean = props.config.addDesignLinkStub ?? "";
    const addStepFunctionDesignImgStub: boolean = props.config.addStepFunctionDesignImgStub ?? "";
    const addOpenApiLinkStub: boolean = props.config.addOpenApiLinkStub ?? "";
    const addApiGatewayUsageInstructionStub: boolean = props.config.addApiGatewayUsageInstructionStub ?? "";
    const addPostmanLinkStub: boolean = props.config.addPostmanLinkStub ?? "";
    const addPostmanSecretsLinkStub: boolean = props.config.addPostmanSecretsLinkStub ?? "";
    const selectedMarkdownSections: string[] = props.config.selectedMarkdownSections ?? [];

    const initialListOfOptions = mapValuesToSelectProps(selectedMarkdownSections);

    const onFormSubmit = () => {
        const showStepFunctionDefinitionValue: boolean = form.getFieldValue("showStepFunctionDefinition") ?? showStepFunctionDefinition;
        const showStepFunctionStepsValue: boolean = form.getFieldValue("showStepFunctionSteps") ?? showStepFunctionSteps;
        const showLambdaVarsValue: boolean = form.getFieldValue("showLambdaVars") ?? showLambdaVars;
        const showLambdaVarsValuesValue: boolean = form.getFieldValue("showLambdaVarsValues") ?? showLambdaVarsValues;
        const showApiGatewayEndpointMaintainerColumnValue: boolean = form.getFieldValue(
            "showApiGatewayEndpointMaintainerColumn") ?? showApiGatewayEndpointMaintainerColumn;
        const showApiGatewayEndpointDocsLinkColumnValue: boolean = form.getFieldValue(
            "showApiGatewayEndpointDocsLinkColumn") ?? showApiGatewayEndpointDocsLinkColumn;
        const addDynamoDbExamplesStubValue: boolean = form.getFieldValue("addDynamoDbExamplesStub") ?? addDynamoDbExamplesStub;
        const addDesignLinkStubValue: boolean = form.getFieldValue("addDesignLinkStub") ?? addDesignLinkStub;
        const addStepFunctionDesignImgStubValue: boolean = form.getFieldValue("addStepFunctionDesignImgStub") ?? addStepFunctionDesignImgStub;
        const addOpenApiLinkStubValue: boolean = form.getFieldValue("addOpenApiLinkStub") ?? addOpenApiLinkStub;
        const addApiGatewayUsageInstructionStubValue: boolean = form.getFieldValue("addApiGatewayUsageInstructionStub") ?? addApiGatewayUsageInstructionStub;
        const addPostmanLinkStubValue: boolean = form.getFieldValue("addPostmanLinkStub") ?? addPostmanLinkStub;
        const addPostmanSecretsLinkStubValue: boolean = form.getFieldValue("addPostmanSecretsLinkStub") ?? addPostmanSecretsLinkStub;
        const selectedMarkdownSectionsValue = form.getFieldValue("selectedMarkdownSections") ?? selectedMarkdownSections;

        const selectedWriters = selectedMarkdownSectionsValue.map((w: string | { label: string, value: string }) => {
            if (typeof w == "string") {
                return w;
            } else {
                return w.value;
            }
        });

        const result: OtherAppConfiguration = {
            showStepFunctionDefinition: showStepFunctionDefinitionValue,
            showStepFunctionSteps: showStepFunctionStepsValue,
            showLambdaVars: showLambdaVarsValue,
            showLambdaVarsValues: showLambdaVarsValuesValue,
            showApiGatewayEndpointMaintainerColumn: showApiGatewayEndpointMaintainerColumnValue,
            showApiGatewayEndpointDocsLinkColumn: showApiGatewayEndpointDocsLinkColumnValue,
            addDynamoDbExamplesStub: addDynamoDbExamplesStubValue,
            addDesignLinkStub: addDesignLinkStubValue,
            addStepFunctionDesignImgStub: addStepFunctionDesignImgStubValue,
            addOpenApiLinkStub: addOpenApiLinkStubValue,
            addApiGatewayUsageInstructionStub: addApiGatewayUsageInstructionStubValue,
            addPostmanLinkStub: addPostmanLinkStubValue,
            addPostmanSecretsLinkStub: addPostmanSecretsLinkStubValue,
            selectedMarkdownSections: selectedWriters.slice(),
        };

        props.onChange(result);
        messageApi.info("Application Other Configuration Values are Changed");
        console.log(result);
    };

    return <Card style={{width: "100%"}} title={"Other Markdown Configurations"}>
        {contextHolder}
        <Form form={form} name="OtherAppConfigurationForm" onFinish={() => onFormSubmit()} style={{maxWidth: 600}}>
            <Form.Item label="Show Step Function JSON Definition"
                       name="showStepFunctionDefinition"
                       valuePropName="checked"
                       initialValue={showStepFunctionDefinition}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Step Function Steps Description"
                       name="showStepFunctionSteps"
                       valuePropName="checked"
                       initialValue={showStepFunctionSteps}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show LambdaFunction Environment Variables"
                       name="showLambdaVars"
                       valuePropName="checked"
                       initialValue={showLambdaVars}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show LambdaFunction Environment Variables and Their Values"
                       name="showLambdaVarsValues"
                       valuePropName="checked"
                       initialValue={showLambdaVarsValues}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Api Gatewa Endpoint Maintainer Column"
                       name="showApiGatewayEndpointMaintainerColumn"
                       valuePropName="checked"
                       initialValue={showApiGatewayEndpointMaintainerColumn}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Show Api Gatewa Endpoint Documentation Link Column"
                       name="showApiGatewayEndpointDocsLinkColumn"
                       valuePropName="checked"
                       initialValue={showApiGatewayEndpointDocsLinkColumn}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for DynamoDB Record Example"
                       name="addDynamoDbExamplesStub"
                       valuePropName="checked"
                       initialValue={addDynamoDbExamplesStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for Desing Link"
                       name="addDesignLinkStub"
                       valuePropName="checked"
                       initialValue={addDesignLinkStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for Step Function Design Image Link"
                       name="addStepFunctionDesignImgStub"
                       valuePropName="checked"
                       initialValue={addStepFunctionDesignImgStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for Open API Link"
                       name="addOpenApiLinkStub"
                       valuePropName="checked"
                       initialValue={addOpenApiLinkStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for API Gateway Usage Instruction Link"
                       name="addApiGatewayUsageInstructionStub"
                       valuePropName="checked"
                       initialValue={addApiGatewayUsageInstructionStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for Postman Collection Link"
                       name="addPostmanLinkStub"
                       valuePropName="checked"
                       initialValue={addPostmanLinkStub}>
                <Switch/>
            </Form.Item>
            <Form.Item label="Add Stub for Postman Collection Secrets Link"
                       name="addPostmanSecretsLinkStub"
                       valuePropName="checked"
                       initialValue={addPostmanSecretsLinkStub}>
                <Switch/>
            </Form.Item>

            <Form.Item label={"Sections that will be added to final Markdown Result"} name="selectedMarkdownSections"
                       initialValue={initialListOfOptions}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: "100%"}}
                    placeholder="Please select"
                    options={DEFAULT_OPTIONS}
                />
            </Form.Item>

            <Form.Item>
                <Button type="dashed" htmlType="submit">Submit Data</Button>
            </Form.Item>
        </Form>
    </Card>;
};

export default OtherAppConfigurations;