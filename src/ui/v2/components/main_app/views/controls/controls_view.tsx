import React from "react";

import { isEmptyString }            from "../../../../../../core/string_utils";
import MainControlHeaderButtonsView from "./view_items/main_control_header_buttons_view";
import RawTemplateEditorView        from "./view_items/raw_template_editor_view";
import ParsingConfigurationView     from "./view_items/parsing_configuration_view";
import { ParsingConfiguration }     from "../../../../../../core/config/models";
import logger from "../../../../../../logger";


type ControlsContentViewProps = {
    onFileNameUpdated: (fileName: string) => void;
    onJsonTemplateUpdated: (jsonTemplate: string) => void;
    onParsingConfigurationChanged: (config: ParsingConfiguration) => void;
    onResetButtonClicked: () => void;

    onSwitchEditorStateUpdated: (value: boolean) => void;
    onSwitchControlStateUpdated: (value: boolean) => void;

    fileName: string;
    jsonTemplate: string;
    parsingConfiguration: ParsingConfiguration;

    switchEditorState: boolean;
    switchControlState: boolean;

    selectedEditor: string;
    onEditorChange: (editor: string) => void;
}

const ControlsContentView: React.FC<ControlsContentViewProps> = (props: ControlsContentViewProps) => {
    const setJsonTemplateValue = (text: string) => {
        logger.debug(text, "setJsonTemplateValue passed value");
        if (isEmptyString(text)) {
            props.onSwitchEditorStateUpdated(false);
            props.onJsonTemplateUpdated(text);
            logger.debug(text, "setJsonTemplateValue, text was empty");
        } else {
            props.onSwitchEditorStateUpdated(true);
            props.onSwitchControlStateUpdated(true);
            props.onJsonTemplateUpdated(text);
            logger.debug(text, "setJsonTemplateValue, non empty string");
        }
    };

    return (
        <>
            <MainControlHeaderButtonsView
                onJsonTemplateChanged={(value) => setJsonTemplateValue(value)}
                onFileNameChanged={(value) => props.onFileNameUpdated(value)}

                onControlSwitchChanged={(value) => props.onSwitchControlStateUpdated(value)}
                onEditorSwitchChanged={(value) => props.onSwitchEditorStateUpdated(value)}

                switchControlValue={props.switchControlState}
                switchEditorValue={props.switchEditorState}

                uploadedFileName={props.fileName}

                onResetButtonClicked={() => props.onResetButtonClicked()}
            />

            <RawTemplateEditorView
                onChange={(text) => setJsonTemplateValue(text)}
                jsonTemplate={props.jsonTemplate}
                showElement={props.switchEditorState}
            />

            <br/>

            <ParsingConfigurationView
                onChange={(config) => props.onParsingConfigurationChanged(config)}
                parsingConfiguration={props.parsingConfiguration}
                showElement={props.switchControlState}
                selectedEditor={props.selectedEditor}
                onEditorChange={props.onEditorChange}
            />
        </>
    );
};

export default ControlsContentView;