import React, { useState }                         from "react";
import { Col, Row }                                from "antd";
import MdEditor                                    from "./md_editor";
import MdViewer                                    from "./md_view";
import JsonInputModal                              from "./json_input_modal";
import { parseCloudForgeTemplate }                 from "../../aws/parser";
import { mapAwsResourcesToMd }                     from "../../md/mapper";
import { writeDescriptionForStack }                from "../../md/aws_md_writer";
import EditingOptionsComponent, { EditingOptions } from "./editing_options";

type AppContentProps = {
    modalIsOpened: boolean;
    onModalClosed: () => void;
}
const AppContent: React.FC<AppContentProps> = (props: AppContentProps) => {
    const [currentJsonTemplate, setCurrentJsonTemplate] = useState("");
    const [currentMdData, setCurrentMdData] = useState("");
    const [prefixToRemove, setPrefixToRemove] = useState("");
    const [suffixToRemove, setSuffixToRemove] = useState("");

    function parseTemplate(data: string, fixNames: boolean, prefix: string, suffix: string) {
        try {
            const template = parseCloudForgeTemplate(data, fixNames, prefix, suffix);
            const documentResourcesTree = mapAwsResourcesToMd(template);
            const mdContent = writeDescriptionForStack(documentResourcesTree);
            setCurrentMdData(mdContent);
        } catch (e) {
            console.log(e);
            setCurrentMdData("");
        }
    }

    const onOptionsChange = (options: EditingOptions) => {
        setPrefixToRemove(options.prefixToRemove);
        setSuffixToRemove(options.suffixToRemove);
        parseTemplate(currentJsonTemplate, true, options.prefixToRemove, options.suffixToRemove);
    };

    const handleOk = (data: string) => {
        if (data !== undefined && data.length > 0) {
            setCurrentJsonTemplate(data);
            parseTemplate(data, true, prefixToRemove, suffixToRemove);
        }
        props.onModalClosed();
    };

    return <div>
        <Row>
            <Col span={24}>
                <EditingOptionsComponent onChange={(opt) => onOptionsChange(opt)}/>
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                <MdEditor initData={currentMdData} onChange={(data) => setCurrentMdData(data)}/>
            </Col>
            <Col span={12}>
                <MdViewer content={currentMdData}/>
            </Col>
        </Row>

        <JsonInputModal isOpen={props.modalIsOpened}
                        onConfirm={(data) => handleOk(data)}
                        onCancel={() => props.onModalClosed()}/>
    </div>;
};

export default AppContent;