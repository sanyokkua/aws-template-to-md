import React                        from "react";
import { Button, Col, Row, Switch } from "antd";


export type ParsingControlPanelHeaderLineProps = {
    hideControlsPanel: boolean;
    hideJsonEditor: boolean;
    onSetJsonTemplateBtnClicked: () => void;
    onHideControlSwitchClicked: (checked: boolean) => void;
    onHideJsonSwitchClicked: (checked: boolean) => void;
}

const ParsingControlPanelHeaderLine: React.FC<ParsingControlPanelHeaderLineProps> = (props: ParsingControlPanelHeaderLineProps) => {
    return <Row>
        <Col span={4}>
            <Switch checkedChildren="Hide Control Panel" unCheckedChildren="Show Control Panel"
                    onChange={props.onHideControlSwitchClicked}
                    defaultChecked={props.hideControlsPanel}/>
        </Col>
        <Col span={4}>
            <Switch checkedChildren="Hide Json Editor" unCheckedChildren="Show Json Editor"
                    onChange={props.onHideJsonSwitchClicked}
                    defaultChecked={props.hideJsonEditor}/>
        </Col>
        <Col span={8}>
            <Button type="primary" size={"small"} onClick={() => props.onSetJsonTemplateBtnClicked()}>
                Paste from clipboard
            </Button>
        </Col>
    </Row>;
};

export default ParsingControlPanelHeaderLine;