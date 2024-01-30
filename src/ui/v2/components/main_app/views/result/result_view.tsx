import React                    from "react";
import { Skeleton }             from "antd";
import { isEmptyString }        from "../../../../../../core/string_utils";
import MarkdownEditorPlusViewer from "../../../common/markdown/markdown_editor_plus_viewer";

export type ResultContentComponentProps = {
    markdownText: string;
    onChange: (markdownText: string) => void;
}

const ResultContentComponent: React.FC<ResultContentComponentProps> = (props: ResultContentComponentProps) => {
    if (isEmptyString(props.markdownText)) {
        return <Skeleton/>;
    }

    return <>
        <MarkdownEditorPlusViewer
            markdownText={props.markdownText}
            showBorders={true}
            onChange={(data) => props.onChange(data)}
        />
    </>;
};

export default ResultContentComponent;