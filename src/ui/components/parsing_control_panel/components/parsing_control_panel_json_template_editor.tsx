import React      from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs }  from "@uiw/codemirror-extensions-langs";


export type ParsingControlPanelJsonTemplateEditorProps = {
    showElement: boolean;
    jsonTemplate: string;
    onChange: (data: string) => void;
}

const ParsingControlPanelJsonTemplateEditor: React.FC<ParsingControlPanelJsonTemplateEditorProps> = (props: ParsingControlPanelJsonTemplateEditorProps) => {
    return <>
        {props.showElement && <CodeMirror
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
        />}
    </>;
};

export default ParsingControlPanelJsonTemplateEditor;