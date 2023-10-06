import React, { useState }                                              from "react";
import type { SelectProps }                                             from "antd";
import { Button, Checkbox, Col, Input, Row, Segmented, Select, Switch } from "antd";
import type { CheckboxChangeEvent }                                     from "antd/es/checkbox";
import { langs }                                                        from "@uiw/codemirror-extensions-langs";
import CodeMirror                                                       from "@uiw/react-codemirror";
import JsonInputModal                                                   from "./json_input_modal";
import OptionsTagEditor                                                 from "./options_tag_editor";
import { AccountInfo, Maintainer, RepositoryInfo, Tag }                 from "../../md/writers/customs/models";
import MaintainersEditor                                                from "./maintainers_editor";
import AccountsEditor                                                   from "./accounts_editor";
import CustomTextEditor                                                 from "./custom_text_editor";
import RepositoryInfoEditor                                             from "./repository_info_editor";
import { AVAILABLE_WRITERS }                                            from "../../md/document_parser";

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
    writeTags: Tag[];
    writeMaintainers: Maintainer[];
    writeRepositoryInfo: RepositoryInfo;
    writeAccountInfo: AccountInfo[];
    writeCustomMdText: string;
}
type EditingOptionsComponentProps = {
    onParseButtonClicked: (options: EditingOptions) => void;
}

const WRITERS: SelectProps["options"] = AVAILABLE_WRITERS.map(name => {
    return {
        label: name,
        value: name,
    };
});

const DEFAULT_WRITERS: string[] = AVAILABLE_WRITERS.slice();
const EDITORS: string[] = ["HIDE", "Tags", "Maintainers", "Repository", "Accounts", "CustomMD"];

const EditingOptionsComponent: React.FC<EditingOptionsComponentProps> = (props: EditingOptionsComponentProps) => {
    // Component Controls
    const [showTemplateJsonSwitch, setShowTemplateJsonSwitch] = useState<boolean>(false);
    const [showOptionsSwitch, setShowOptionsSwitch] = useState<boolean>(true);
    const [selectedEditor, setSelectedEditor] = useState<string>("HIDE");
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    // Component Result Values
    const [sfDefCheckbox, setSfDefCheckbox] = useState<boolean>(false);
    const [sfDiagramCheckbox, setSfDiagramCheckbox] = useState<boolean>(true);
    const [lambdaVarsValuesCheckbox, setLambdaVarsValuesCheckbox] = useState<boolean>(false);
    const [archDiagramCheckbox, setArchDiagramCheckbox] = useState<boolean>(true);
    const [repositoryName, setRepositoryName] = useState<string>("");
    const [prefix, setPrefix] = useState<string>("");
    const [suffix, setSuffix] = useState<string>("");
    const [jsonTemplateValue, setJsonTemplateValue] = useState<string>("");
    const [writers, setWriters] = useState<string[]>(DEFAULT_WRITERS);

    const [tags, setTags] = useState<Tag[]>([]);
    const [maintainers, setMaintainers] = useState<Maintainer[]>([]);
    const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo>({} as RepositoryInfo);
    const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);
    const [customMdText, setCustomMdText] = useState<string>("");


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
                                       writeTags: tags,
                                       writeMaintainers: maintainers,
                                       writeRepositoryInfo: repositoryInfo,
                                       writeAccountInfo: accountInfo,
                                       writeCustomMdText: customMdText,
                                   });
    };

    function handleModalData(data: string) {
        setJsonTemplateValue(data);
        setModalIsOpen(false);
    }

    return <div>
        <Row>
            <Col span={8}>
                <Button type="primary" onClick={onSetCloudFormButtonClicked}>
                    Set Cloud Formation Template JSON
                </Button>
            </Col>
            <Col span={4}>
                <Switch checkedChildren="Hide Options" unCheckedChildren="Show Options"
                        onChange={onShowOptionsSwitchChanged}
                        defaultChecked={showOptionsSwitch}/>
            </Col>
            <Col span={4}>
                <Switch checkedChildren="Hide Json" unCheckedChildren="Show Json"
                        onChange={onShowJsonSwitchChanged}
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
        </Row>}

        {showOptionsSwitch && <div>
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

            <Segmented options={EDITORS} onChange={(value) => setSelectedEditor(value.toString())}/>

            {selectedEditor === "Tags" && <Row>
                <Col span={24}>
                    <OptionsTagEditor tagsList={tags}
                                      onValuesChanged={(tags) => setTags(tags)}/>
                </Col>
            </Row>}


            {selectedEditor === "Maintainers" && <Row>
                <Col>
                    <MaintainersEditor maintainersList={maintainers}
                                       onValuesChanged={(maintainers => setMaintainers(maintainers))}/>
                </Col>
            </Row>}

            {selectedEditor === "Repository" && <Row>
                <Col>
                    <RepositoryInfoEditor repoInfo={repositoryInfo}
                                          onValuesChanged={(value) => setRepositoryInfo(value)}/>
                </Col>
            </Row>}

            {selectedEditor === "Accounts" && <Row>
                <Col>
                    <AccountsEditor accountList={accountInfo}
                                    onValuesChanged={(value) => setAccountInfo(value)}/>
                </Col>
            </Row>}

            {selectedEditor === "CustomMD" && <Row>
                <Col>
                    <CustomTextEditor customText={customMdText} onValuesChanged={(value) => setCustomMdText(value)}/>
                </Col>
            </Row>}
        </div>}
        <Row>
            <Col span={24}>
                <Button type="primary" onClick={() => onParseButtonClicked()}>Parse</Button>
            </Col>
        </Row>
        <JsonInputModal isOpen={modalIsOpen} onConfirm={(data) => handleModalData(data)}
                        onCancel={() => setModalIsOpen(false)}/>
    </div>;
};

export default EditingOptionsComponent;