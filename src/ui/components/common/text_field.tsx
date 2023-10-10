import React               from "react";
import { Col, Input, Row } from "antd";
import TextArea            from "antd/es/input/TextArea";


export type TextFieldProps = {
    name: string;
    value: string;
    isReadOnly?: boolean;
    isTextArea?: boolean;
    onChange?: (text: string) => void;
}

const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
    const onTextChanged = (data: any) => {
        if (data !== undefined && typeof data === "string" && props.onChange !== undefined) {
            props.onChange(data);
        }
    };

    const isReadOnly: boolean = props.isReadOnly !== undefined && props.isReadOnly;
    const isTextArea: boolean = props.isTextArea !== undefined && props.isTextArea;

    return <Row>
        <Col span={4}>
            {props.name}:
        </Col>
        <Col span={20}>
            {isTextArea && <TextArea value={props.value} onChange={(e: any) => onTextChanged(e.target.value)}
                                     readOnly={isReadOnly}/>}
            {!isTextArea && <Input placeholder={props.name} onChange={(e: any) => onTextChanged(e.target.value)}
                                   readOnly={isReadOnly}/>}
        </Col>
    </Row>;
};

export default TextField;