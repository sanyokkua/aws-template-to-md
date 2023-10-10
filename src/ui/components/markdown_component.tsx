import React        from "react";
import { Col, Row } from "antd";
import MdEditor     from "./common/md_editor";
import MdViewer     from "./common/md_view";


export type MarkDownComponentProps = {
    markdownText: string;
    onChange: (markdownText: string) => void;
}

const MarkDownComponent: React.FC<MarkDownComponentProps> = (props: MarkDownComponentProps) => {
    const showContent: boolean = props.markdownText !== undefined && props.markdownText.length > 0;
    return <div>
        {!showContent && <h3>Nothing to show. Please Parse Json template...</h3>}
        {showContent && <Row>
            <Col span={12}>
                <h3>Editor:</h3>
                <MdEditor initData={props.markdownText} onChange={(data) => props.onChange(data)}/>
            </Col>
            <Col span={12}>
                <h3>Preview:</h3>
                <MdViewer content={props.markdownText}/>
            </Col>
        </Row>}

    </div>;
};

export default MarkDownComponent;