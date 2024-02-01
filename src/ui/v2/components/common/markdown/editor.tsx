import React      from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs }  from "@uiw/codemirror-extensions-langs";

type MarkdownEditorProps = {
    content: string;
    onChange: (data: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props: MarkdownEditorProps) => {
    const onContentChanged = (changedData: string) => {
        props.onChange(changedData);
    };

    return <CodeMirror
        value={props.content}
        basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
        }}
        extensions={[langs.markdown()]}
        onChange={(data) => onContentChanged(data)}
    />;
};

export default MarkdownEditor;