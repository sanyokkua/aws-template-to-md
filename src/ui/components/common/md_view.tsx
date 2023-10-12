import React           from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

type MdViewerProps = {
    content: string;
}
const MdViewer: React.FC<MdViewerProps> = (props: MdViewerProps) => {
    return <div>
        <MarkdownPreview source={props.content}/>
    </div>;
};

export default MdViewer;