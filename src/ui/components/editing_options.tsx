import React, { useState }           from "react";
import { Checkbox, Col, Input, Row } from "antd";
import type { CheckboxChangeEvent }  from "antd/es/checkbox";

export type EditingOptions = {
    prefixToRemove: string;
    suffixToRemove: string;
}
type EditingOptionsComponentProps = {
    onChange: (options: EditingOptions) => void;
}
const EditingOptionsComponent: React.FC<EditingOptionsComponentProps> = (props: EditingOptionsComponentProps) => {
    const [sfDefCheckbox, setSfDefCheckbox] = useState(true);
    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");

    const onStepFunctionDefCheckboxChange = (e: CheckboxChangeEvent) => {
        setSfDefCheckbox(e.target.checked);
    };

    const onPrefixChange = (data: string) => {
        setPrefix(data);
        props.onChange({
                           prefixToRemove: data,
                           suffixToRemove: suffix,
                       });
    };
    const onSuffixChange = (data: string) => {
        setSuffix(data);
        props.onChange({
                           prefixToRemove: prefix,
                           suffixToRemove: data,
                       });
    };

    return <div>
        <Row>
            <Col span={24}>
                <Checkbox checked={sfDefCheckbox} onChange={onStepFunctionDefCheckboxChange}>
                    Show Step Function Definition
                </Checkbox>
            </Col>
        </Row>
        <Row>
            <Col span={4}>
                Input Prefix to remove:
            </Col>
            <Col span={20}>
                <Input placeholder="Prefix" onChange={(e: any) => onPrefixChange(e.target.value)}/>
            </Col>
        </Row>
        <Row>
            <Col span={4}>
                Input Suffix to remove:
            </Col>
            <Col span={20}>
                <Input placeholder="Suffix" onChange={(e: any) => onSuffixChange(e.target.value)}/>
            </Col>
        </Row>
    </div>;
};

export default EditingOptionsComponent;