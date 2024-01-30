import React           from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

type MarkdownViewerProps = {
    content: string;
}
const MarkdownViewer: React.FC<MarkdownViewerProps> = (props: MarkdownViewerProps) => {
    return <MarkdownPreview source={props.content}/>;
};

export default MarkdownViewer;