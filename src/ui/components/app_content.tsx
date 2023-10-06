import React, { useState }             from "react";
import { Col, Row }                    from "antd";
import MdEditor                        from "./md_editor";
import MdViewer                        from "./md_view";
import EditingOptionsComponent         from "./editing_options";
import { parseCloudFormationTemplate } from "../../md/document_parser";
import { ParserParameters }            from "../../md/writers/customs/models";

type AppContentProps = {}
const AppContent: React.FC<AppContentProps> = (props: AppContentProps) => {
    const [currentMdData, setCurrentMdData] = useState<string>("");
    const [parserParameters, setParserParameters] = useState<ParserParameters>({} as ParserParameters);

    function parseTemplate(params: ParserParameters) {
        try {
            const result = parseCloudFormationTemplate(params);
            setCurrentMdData(result);
        } catch (e) {
            console.log(e);
            setCurrentMdData("");
        }
    }

    const onOptionsChange = (options: ParserParameters) => {
        setParserParameters(options);
        parseTemplate(options);
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