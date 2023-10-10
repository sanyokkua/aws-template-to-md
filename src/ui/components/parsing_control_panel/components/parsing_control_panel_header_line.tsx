import React                        from "react";
import { Button, Col, Row, Switch } from "antd";


export type ParsingControlPanelHeaderLineProps = {
    hideOptions: boolean;
    hideJson: boolean;
    onSetJsonTemplateBtnClicked: () => void;
    onHideOptionsSwitchClicked: (checked: boolean) => void;
    onHideJsonSwitchClicked: (checked: boolean) => void;
}

const ParsingControlPanelHeaderLine: React.FC<ParsingControlPanelHeaderLineProps> = (props: ParsingControlPanelHeaderLineProps) => {
    return <Row>
        <Col span={8}>
            <Button type="primary" onClick={() => props.onSetJsonTemplateBtnClicked()}>
                Set Cloud Formation Template JSON
            </Button>
        </Col>
        <Col span={4}>
            <Switch checkedChildren="Hide Options" unCheckedChildren="Show Options"
                    onChange={props.onHideOptionsSwitchClicked}
                    defaultChecked={props.hideOptions}/>
        </Col>
        <Col span={4}>
            <Switch checkedChildren="Hide Json" unCheckedChildren="Show Json"
                    onChange={props.onHideJsonSwitchClicked}
                    defaultChecked={props.hideJson}/>
        </Col>
    </Row>;
};

export default ParsingControlPanelHeaderLine;