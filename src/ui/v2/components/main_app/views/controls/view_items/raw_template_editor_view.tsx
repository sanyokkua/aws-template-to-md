import React      from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs }  from "@uiw/codemirror-extensions-langs";
import { Card }   from "antd";


export type RawTemplateEditorProps = {
    showElement: boolean;
    jsonTemplate: string;
    onChange: (data: string) => void;
}

const RawTemplateEditorView: React.FC<RawTemplateEditorProps> = (props: RawTemplateEditorProps) => {
    if (!props.showElement) {
        return <></>;
    }

    return <>
        <Card size="small" bordered={false} style={{width: "100%"}} title={"Raw Template Editor"}>
            <CodeMirror
                value={props.jsonTemplate}
                height="500px"
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
        </Card>
    </>;
};

export default RawTemplateEditorView;