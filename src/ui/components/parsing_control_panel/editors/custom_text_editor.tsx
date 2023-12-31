import React           from "react";
import { Card }        from "antd";
import MdEditor        from "../../common/md_editor";
import { EditorInput } from "../../../../md/writers/customs/models";
import MdViewer        from "../../common/md_view";

type CustomTextEditorProps = {
    editorInput: EditorInput<string>;
}
const CustomTextEditor: React.FC<CustomTextEditorProps> = (props: CustomTextEditorProps) => {
    return <Card style={{width: "100%"}} title={"Add Custom MD text to end of document"}>
        <MdEditor initData={props.editorInput.data} onChange={(value) => props.editorInput.onDataChanged(value)}/>
        <h3>Submitted values:</h3>
        <MdViewer content={props.editorInput.data}/>
    </Card>;
};

export default CustomTextEditor;