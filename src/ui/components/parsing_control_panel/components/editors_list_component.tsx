import React                             from "react";
import { Col, Row, Select, SelectProps } from "antd";


export type EditorsListComponentProps = {
    showElement: boolean;
    defaultWriters: string[];
    options: SelectProps["options"];
    onChange: (value: string[]) => void
}

const EditorsListComponent: React.FC<EditorsListComponentProps> = (props: EditorsListComponentProps) => {
    return <div>
        {props.showElement && <Row>
            <Col span={4}>
                Select Parser Components:
            </Col>
            <Col span={20}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: "100%"}}
                    placeholder="Please select"
                    defaultValue={props.defaultWriters}
                    options={props.options}
                    onChange={props.onChange}
                />
            </Col>
        </Row>}
    </div>;
};

export default EditorsListComponent;