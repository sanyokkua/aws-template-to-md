import React                from "react";
import { Col, Row, Switch } from "antd";


export type ParsingControlPanelHeaderLineProps = {
    hideControlsPanel: boolean;
    hideJsonEditor: boolean;
    onSetJsonTemplateBtnClicked: () => void;
    onHideControlSwitchClicked: (checked: boolean) => void;
    onHideJsonSwitchClicked: (checked: boolean) => void;
}

const ParsingControlPanelHeaderLine: React.FC<ParsingControlPanelHeaderLineProps> = (props: ParsingControlPanelHeaderLineProps) => {
    return <Row>
        {/*<Col span={8}>*/}
        {/*    <Button type="primary" onClick={() => props.onSetJsonTemplateBtnClicked()}>*/}
        {/*        Set Cloud Formation Template JSON*/}
        {/*    </Button>*/}
        {/*</Col>*/}
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
    </Row>;
};

export default ParsingControlPanelHeaderLine;