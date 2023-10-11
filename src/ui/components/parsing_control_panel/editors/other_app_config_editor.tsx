import React                                                          from "react";
import { Button, Card, Form, List, Row, Select, SelectProps, Switch } from "antd";
import { EditorInput, OtherAppConfig }                                from "../../../../md/writers/customs/models";
import { AVAILABLE_WRITERS }                                          from "../../../../md/document_parser";
import { getCurrentOrDefault }                                        from "../../../../utils/utils";

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
    const [form] = Form.useForm();

    const onFormSubmit = () => {
        const showStepFunctionDiagram = form.getFieldValue("showStepFunctionDiagram");
        const showArchitectureDiagramLinkTemplate = form.getFieldValue("showArchitectureDiagramLinkTemplate");
        const writers = form.getFieldValue("selectWriters");

        const showStepFunctionDiagramValue = getCurrentOrDefault<boolean>(showStepFunctionDiagram,
                                                                          props.editorInput.data.enableStepFunctionDiagramLinkTemplate);
        const showArchitectureDiagramLinkTemplateValue = getCurrentOrDefault<boolean>(
            showArchitectureDiagramLinkTemplate,
            props.editorInput.data.enableArchitectureDiagramImgLinkTemplate);
        const writersValue = getCurrentOrDefault(writers, props.editorInput.data.selectedWriters);

        const selectedWriters = writersValue.map((w: string | { label: string, value: string }) => {
            if (typeof w == "string") {
                return w;
            } else {
                return w.value;
            }
        });

        props.editorInput.onDataChanged({
                                            enableArchitectureDiagramImgLinkTemplate: showArchitectureDiagramLinkTemplateValue,
                                            enableStepFunctionDiagramLinkTemplate: showStepFunctionDiagramValue,
                                            selectedWriters: selectedWriters,
                                        });
    };
    return <Card style={{width: "100%"}} title={"Other Markdown Configurations"}>
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

        <Row><h3>Confirmed Values:</h3></Row>
        <Row>
            <Switch checkedChildren="Step Function Diagram Image Link Will Be Added"
                    unCheckedChildren="Step Function Diagram Image Link Will Be Added"
                    checked={props.editorInput.data.enableStepFunctionDiagramLinkTemplate}
                    disabled={true}/>
            <Switch checkedChildren="Architecture Diagram Image Link Will Be Added"
                    unCheckedChildren="Architecture Diagram Image Link Will Be Added"
                    checked={props.editorInput.data.enableArchitectureDiagramImgLinkTemplate}
                    disabled={true}/>
        </Row>
        <Row>
            <List
                header={<h4>Selected Writers</h4>}
                bordered
                dataSource={props.editorInput.data.selectedWriters}
                renderItem={(item) => (
                    <List.Item key={item}>
                        - {item}
                    </List.Item>
                )}
            />
        </Row>
    </Card>;
};

export default OtherAppConfigEditor;