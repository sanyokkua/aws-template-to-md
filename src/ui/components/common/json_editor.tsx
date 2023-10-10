import React, { useState } from "react";
import { langs }           from "@uiw/codemirror-extensions-langs";
import CodeMirror          from "@uiw/react-codemirror";

type JsonEditorProps = {
    onChange: (data: string) => void;
}

const JsonEditor: React.FunctionComponent<JsonEditorProps> = (props: JsonEditorProps) => {
    const [data, setData] = useState("");
    const onDataChanged = (changedData: string) => {
        setData(changedData);
        props.onChange(changedData);
    };

    return <div>
        <CodeMirror
            value={data}
            height="300px"
            basicSetup={{
                foldGutter: true,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                autocompletion: true,
            }}
            extensions={[langs.json()]}
            onChange={(data) => onDataChanged(data)}
        />
    </div>;
};
export default JsonEditor;