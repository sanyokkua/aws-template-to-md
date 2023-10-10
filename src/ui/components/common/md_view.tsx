import React     from "react";
import Markdown  from "react-markdown";
import remarkGfm from "remark-gfm";

type MdViewerProps = {
    content: string;
}
const MdViewer: React.FC<MdViewerProps> = (props: MdViewerProps) => {
    return <div>
        <Markdown remarkPlugins={[remarkGfm]}>{props.content}</Markdown>
    </div>;
};

export default MdViewer;