import React        from "react";
import { Col, Row } from "antd";
import CodeMirror   from "@uiw/react-codemirror";
import { langs }    from "@uiw/codemirror-extensions-langs";


export type ParsingControlPanelJsonTemplateEditorProps = {
    showElement: boolean;
    jsonTemplate: string;
    onChange: (data: string) => void;
}

const ParsingControlPanelJsonTemplateEditor: React.FC<ParsingControlPanelJsonTemplateEditorProps> = (props: ParsingControlPanelJsonTemplateEditorProps) => {
    return <div>
        {props.showElement && <Row>
            <Col span={24}>
                <CodeMirror
                    value={props.jsonTemplate}
                    height="300px"
                    basicSetup={{
                        foldGutter: true,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: true,
                        autocompletion: true,
                    }}
                    extensions={[langs.json()]}
                    onChange={(data) => props.onChange(data)}
                />
            </Col>
        </Row>}
    </div>;
};

export default ParsingControlPanelJsonTemplateEditor;