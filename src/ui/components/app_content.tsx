import React, { useState }                           from "react";
import { Col, Row }                                  from "antd";
import MdEditor                                      from "./md_editor";
import MdViewer                                      from "./md_view";
import { parseCloudForgeTemplate }                   from "../../aws/parser";
import { mapAwsResourcesToMd }                       from "../../md/mapper";
import { AVAILABLE_WRITERS, createMarkdownDocument } from "../../md/aws_md_writer";
import EditingOptionsComponent, { EditingOptions }   from "./editing_options";

type AppContentProps = {}
const AppContent: React.FC<AppContentProps> = (props: AppContentProps) => {
    const [currentMdData, setCurrentMdData] = useState("");
    const [prefixToRemove, setPrefixToRemove] = useState("");
    const [suffixToRemove, setSuffixToRemove] = useState("");

    function parseTemplate(data: string, prefix: string, suffix: string) {
        try {
            const template = parseCloudForgeTemplate(data, prefix, suffix);
            const documentResourcesTree = mapAwsResourcesToMd(template);
            const mdContent = createMarkdownDocument(documentResourcesTree, AVAILABLE_WRITERS);
            setCurrentMdData(mdContent);
        } catch (e) {
            console.log(e);
            setCurrentMdData("");
        }
    }

    const onOptionsChange = (options: EditingOptions) => {
        setPrefixToRemove(options.prefixToRemove);
        setSuffixToRemove(options.suffixToRemove);
        parseTemplate(options.jsonTemplateValue, options.prefixToRemove, options.suffixToRemove);
    };

    return <div>
        <Row>
            <Col span={24}>
                <EditingOptionsComponent onParseButtonClicked={(opt) => onOptionsChange(opt)}/>
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
    </div>;
};

export default AppContent;