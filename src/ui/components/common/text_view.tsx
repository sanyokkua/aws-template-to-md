import React               from "react";
import { Col, Input, Row } from "antd";
import TextArea            from "antd/es/input/TextArea";


export type TextViewProps = {
    name: string;
    value: string;
    isTextArea?: boolean;
}

const TextView: React.FC<TextViewProps> = (props: TextViewProps) => {
    const isTextArea: boolean = props.isTextArea !== undefined && props.isTextArea;

    return <Row>
        <Col span={4}>
            {props.name}:
        </Col>
        <Col span={20}>
            {isTextArea && <TextArea value={props.value} readOnly rows={4}/>}
            {!isTextArea && <Input value={props.value} readOnly/>}
        </Col>
    </Row>;
};

export default TextView;