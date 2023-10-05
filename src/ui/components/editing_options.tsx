import React, { useState }                                   from "react";
import type { SelectProps }                                  from "antd";
import { Button, Checkbox, Col, Input, Row, Select, Switch } from "antd";
import type { CheckboxChangeEvent }                          from "antd/es/checkbox";
import { AVAILABLE_WRITERS_WRAPPERS }                        from "../../md/aws_md_writer";
import { langs }                                             from "@uiw/codemirror-extensions-langs";
import CodeMirror                                            from "@uiw/react-codemirror";
import JsonInputModal                                        from "./json_input_modal";


export type EditingOptions = {
    jsonTemplateValue: string;
    repositoryName: string;
    prefixToRemove: string;
    suffixToRemove: string;
    writeStepFunctionDefinition: boolean;
    writeStepFunctionDiagramLinkTemplate: boolean;
    writeLambdaEnvVarValues: boolean;
    writeArchitectureDiagramImgLinkTemplate: boolean;
    writers: string[];
}
type EditingOptionsComponentProps = {
    onParseButtonClicked: (options: EditingOptions) => void;
}

const WRITERS: SelectProps["options"] = AVAILABLE_WRITERS_WRAPPERS.map(opt => {
    return {
        label: opt.Name,
        value: opt.Name,
    };
});

const DEFAULT_WRITERS: string[] = AVAILABLE_WRITERS_WRAPPERS.map(w => w.Name);

const EditingOptionsComponent: React.FC<EditingOptionsComponentProps> = (props: EditingOptionsComponentProps) => {
    const [sfDefCheckbox, setSfDefCheckbox] = useState(false);
    const [sfDiagramCheckbox, setSfDiagramCheckbox] = useState(true);
    const [lambdaVarsValuesCheckbox, setLambdaVarsValuesCheckbox] = useState(false);
    const [archDiagramCheckbox, setArchDiagramCheckbox] = useState(true);
    const [showTemplateJsonSwitch, setShowTemplateJsonSwitch] = useState(false);
    const [showOptionsSwitch, setShowOptionsSwitch] = useState(true);
    const [repositoryName, setRepositoryName] = useState("");
    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");
    const [jsonTemplateValue, setJsonTemplateValue] = useState("");
    const [writers, setWriters] = useState(DEFAULT_WRITERS);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onWritersSelect = (value: string[]) => setWriters(value);
    const onSfDefCheckbox = (e: CheckboxChangeEvent) => setSfDefCheckbox(e.target.checked);
    const onSfDiagramCheckbox = (e: CheckboxChangeEvent) => setSfDiagramCheckbox(e.target.checked);
    const onLambdaVarsValuesCheckbox = (e: CheckboxChangeEvent) => setLambdaVarsValuesCheckbox(e.target.checked);
    const onArchDiagramCheckbox = (e: CheckboxChangeEvent) => setArchDiagramCheckbox(e.target.checked);
    const onRepositoryNameChange = (data: string) => setRepositoryName(data);
    const onPrefixChange = (data: string) => setPrefix(data);
    const onSuffixChange = (data: string) => setSuffix(data);
    const defaultParsers: string[] = writers !== undefined ? writers : [];
    const onShowOptionsSwitchChanged = (checked: boolean) => setShowOptionsSwitch(checked);
    const onShowJsonSwitchChanged = (checked: boolean) => setShowTemplateJsonSwitch(checked);
    const onSetCloudFormButtonClicked = () => setModalIsOpen(true);
    const onParseButtonClicked = () => {
        props.onParseButtonClicked({
                                       jsonTemplateValue: jsonTemplateValue,
                                       repositoryName: repositoryName,
                                       prefixToRemove: prefix,
                                       suffixToRemove: suffix,
                                       writeStepFunctionDefinition: sfDefCheckbox,
                                       writeStepFunctionDiagramLinkTemplate: sfDiagramCheckbox,
                                       writeLambdaEnvVarValues: lambdaVarsValuesCheckbox,
                                       writeArchitectureDiagramImgLinkTemplate: archDiagramCheckbox,
                                       writers: writers,
                                   });
    };

    function handleModalData(data: string) {
        setJsonTemplateValue(data);
        setModalIsOpen(false);
    }

    return <div>
        <Row>
            <Col span={8}>
                <Button type="primary" onClick={() => onSetCloudFormButtonClicked()}>
                    Set Cloud Formation Template JSON
                </Button>
            </Col>
            <Col span={4}>
                <Switch checkedChildren="Hide Options" unCheckedChildren="Show Options"
                        onChange={onShowOptionsSwitchChanged}
                        defaultChecked={showOptionsSwitch}/>
            </Col>
            <Col span={4}>
                <Switch checkedChildren="Hide Json" unCheckedChildren="Show Json" onChange={onShowJsonSwitchChanged}
                        defaultChecked={showTemplateJsonSwitch}/>
            </Col>
        </Row>
        {showTemplateJsonSwitch && <Row>
            <Col span={24}>
                <CodeMirror
                    value={jsonTemplateValue}
                    height="300px"
                    basicSetup={{
                        foldGutter: true,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: true,
                        autocompletion: true,
                    }}
                    extensions={[langs.json()]}
                    onChange={(data) => setJsonTemplateValue(data)}
                />
            </Col>
        </Row>
        }

        {
            showOptionsSwitch && <div>
                <Row>
                    <Col span={4}>
                        <Checkbox checked={sfDefCheckbox} onChange={onSfDefCheckbox}>
                            Show Step Function Definition
                        </Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox checked={sfDiagramCheckbox} onChange={onSfDiagramCheckbox}>
                            Show Step Function Diagram Link Template
                        </Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox checked={lambdaVarsValuesCheckbox} onChange={onLambdaVarsValuesCheckbox}>
                            Show Lambda Var Values
                        </Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox checked={archDiagramCheckbox} onChange={onArchDiagramCheckbox}>
                            Show Architecture Diagram Link Template
                        </Checkbox>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        Select Parser Components:
                    </Col>
                    <Col span={20}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{width: "100%"}}
                            placeholder="Please select"
                            defaultValue={defaultParsers}
                            onChange={onWritersSelect}
                            options={WRITERS}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        Repository Name:
                    </Col>
                    <Col span={20}>
                        <Input placeholder="Name" onChange={(e: any) => onRepositoryNameChange(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        Resource Name Prefix to remove:
                    </Col>
                    <Col span={20}>
                        <Input placeholder="Prefix" onChange={(e: any) => onPrefixChange(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        Resource Name Suffix to remove:
                    </Col>
                    <Col span={20}>
                        <Input placeholder="Suffix" onChange={(e: any) => onSuffixChange(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Repository Tags</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Maintainers: (Name, Link, Contact Email)</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Repository Information: (Main Programming Language, Deployment Destination, Deployment
                            Description,
                            Link to CloudForge)</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Accounts: (Organization, Description, Account ID)</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Custom MD text in the end of README</p>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Button type="primary" onClick={() => onParseButtonClicked()}>Parse</Button>
                    </Col>
                </Row>
            </div>
        }
        <JsonInputModal isOpen={modalIsOpen} onConfirm={(data) => handleModalData(data)}
                        onCancel={() => setModalIsOpen(false)}/>
    </div>;
};

export default EditingOptionsComponent;