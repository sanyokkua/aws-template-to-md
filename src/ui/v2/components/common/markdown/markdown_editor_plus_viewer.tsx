import React          from "react";
import { Col, Row }   from "antd";
import MarkdownEditor from "./editor";
import MarkdownViewer from "./viewer";

const BORDER_STYLE = "1px solid #000";

export enum Show {
    EDITOR,
    VIEWER,
    BOTH
}

export type MarkdownEditorPlusViewerProps = {
    markdownText: string;
    showBorders?: boolean;
    show?: Show;
    onChange: (markdownText: string) => void;
}

const HALF_SIZE: number = 12;
const FULL_SIZE: number = 24;

const MarkdownEditorPlusViewer: React.FC<MarkdownEditorPlusViewerProps> = (props: MarkdownEditorPlusViewerProps) => {
    const show = props?.show ?? Show.BOTH;
    const borders = props.showBorders && {border: BORDER_STYLE};
    const span = Show.BOTH === show ? HALF_SIZE : FULL_SIZE;

    const editorCol = <Col span={span} style={{...borders}}>
        <h3>Editor:</h3>
        <MarkdownEditor content={props.markdownText} onChange={(data) => props.onChange(data)}/>
    </Col>;

    const viewerCol = <Col span={span} style={{...borders}}>
        <h3>Preview:</h3>
        <MarkdownViewer content={props.markdownText}/>
    </Col>;

    let content;

    switch (show) {
        case Show.BOTH: {
            content = <>
                {editorCol}
                {viewerCol}
            </>;
            break;
        }
        case Show.EDITOR: {
            content = <>
                {editorCol}
            </>;
            break;
        }
        case Show.VIEWER: {
            content = <>
                {viewerCol}
            </>;
            break;
        }
    }

    return <>
        <Row>
            {content}
        </Row>
    </>;
};

export default MarkdownEditorPlusViewer;