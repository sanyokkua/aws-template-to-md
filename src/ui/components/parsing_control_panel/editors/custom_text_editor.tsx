import React from "react";

import { Card } from "antd";
import MdEditor from "../../common/md_editor";

type CustomTextEditorProps = {
    customText: string;
    onValuesChanged: (text: string) => void;
}
const CustomTextEditor: React.FC<CustomTextEditorProps> = (props: CustomTextEditorProps) => {
    return <Card style={{width: "100%"}} title={"Add Custom MD text to end of document"}>
        <MdEditor initData={props.customText} onChange={(value) => props.onValuesChanged(value)}/>
    </Card>;
};

export default CustomTextEditor;