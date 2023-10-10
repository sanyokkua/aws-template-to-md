import React      from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs }  from "@uiw/codemirror-extensions-langs";

type MdEditorProps = {
    initData: string;
    onChange: (data: string) => void;
}

const MdEditor: React.FC<MdEditorProps> = (props: MdEditorProps) => {
    const onDataChanged = (changedData: string) => {
        props.onChange(changedData);
    };

    return <div>
        <CodeMirror
            value={props.initData}
            basicSetup={{
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: false,
            }}
            extensions={[langs.markdown()]}
            onChange={(data) => onDataChanged(data)}
        />
    </div>;
};

export default MdEditor;