import React                    from "react";
import { Skeleton }             from "antd";
import { isEmptyString }        from "../../../../../../core/string_utils";
import MarkdownEditorPlusViewer from "../../../common/markdown/markdown_editor_plus_viewer";
import logger from "../../../../../../logger";

export type ResultContentComponentProps = {
    markdownText: string;
    onChange: (markdownText: string) => void;
}

const ResultContentComponent: React.FC<ResultContentComponentProps> = (props: ResultContentComponentProps) => {
    if (isEmptyString(props.markdownText)) {
        logger.debug(props.markdownText, "ResultContentComponent, Skeleton will be displayed");
        return <Skeleton/>;
    }

    logger.debug(props.markdownText, "ResultContentComponent, Editor will be displayed");
    return <>
        <MarkdownEditorPlusViewer
            markdownText={props.markdownText}
            showBorders={true}
            onChange={(data) => props.onChange(data)}
        />
    </>;
};

export default ResultContentComponent;