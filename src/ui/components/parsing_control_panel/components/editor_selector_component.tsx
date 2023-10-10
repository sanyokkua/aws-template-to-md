import React, { useState }     from "react";
import { Col, Row, Segmented } from "antd";

import MaintainersEditor    from "../editors/maintainers_editor";
import RepositoryInfoEditor from "../editors/repository_info_editor";
import AccountsEditor       from "../editors/accounts_editor";
import ArtifactDesignEditor from "../editors/artifact_design_editor";
import CustomTextEditor     from "../editors/custom_text_editor";
import {
    Account,
    ArtifactDesign,
    Maintainer,
    OtherAppConfig,
    ParserConfig,
    RepositoryInfo,
    RepositoryTag,
}                           from "../../../../md/writers/customs/models";
import RepositoryTagsEditor from "../editors/options_tag_editor";
import ParserConfigEditor   from "../editors/parser_config_editor";
import OtherAppConfigEditor from "../editors/other_app_config_editor";


const HIDE: string = "HIDE";
const PARSER: string = "ParserConfig";
const REPOSITORY: string = "Repository";
const RepositoryTagS: string = "RepositoryTags";
const MAINTAINERS: string = "Maintainers";
const ACCOUNTS: string = "Accounts";
const DESIGN: string = "Design";
const CUSTOM_MD: string = "CustomMD";
const OTHER_APP_CONFIG: string = "OtherAppConfig";

const EDITORS: string[] = [
    HIDE,
    PARSER,
    REPOSITORY,
    RepositoryTagS,
    MAINTAINERS,
    ACCOUNTS,
    DESIGN,
    CUSTOM_MD,
    OTHER_APP_CONFIG,
];

export type EditorSelectorProps = {
    showElement: boolean;

    listOfRepositoryTags: RepositoryTag[];
    listOfMaintainers: Maintainer[];
    repositoryInfo: RepositoryInfo;
    listOfAccounts: Account[];
    artifactDesign: ArtifactDesign;
    parserConfig: ParserConfig;
    customMdText: string;
    otherAppConfig: OtherAppConfig;

    onSetListOfRepositoryTags: (RepositoryTags: RepositoryTag[]) => void;
    onSetListOfMaintainers: (maintainers: Maintainer[]) => void;
    onSetRepositoryInfo: (repositoryInfo: RepositoryInfo) => void;
    onSetListOfAccounts: (Account: Account[]) => void;
    onSetArtifactDesign: (designInfo: ArtifactDesign) => void;
    onSetCustomMdText: (customMdText: string) => void;
    onSetParserConfig: (parserConfig: ParserConfig) => void;
    onSetOtherAppConfig: (otherMarkdownConfig: OtherAppConfig) => void;
}

const EditorSelector: React.FC<EditorSelectorProps> = (props: EditorSelectorProps) => {
    const [selectedEditor, setSelectedEditor] = useState<string>(EDITORS[0]);

    const optionsRepositoryTagEditor =
        <RepositoryTagsEditor repositoryTags={props.listOfRepositoryTags}
                              onValuesChanged={props.onSetListOfRepositoryTags}/>;
    const maintainersEditor =
        <MaintainersEditor maintainersList={props.listOfMaintainers} onValuesChanged={props.onSetListOfMaintainers}/>;
    const repositoryInfoEditor =
        <RepositoryInfoEditor repoInfo={props.repositoryInfo} onValuesChanged={props.onSetRepositoryInfo}/>;
    const accountsEditor =
        <AccountsEditor accountList={props.listOfAccounts} onValuesChanged={props.onSetListOfAccounts}/>;
    const artifactDesignInformationEditor =
        <ArtifactDesignEditor designInfo={props.artifactDesign} onValuesChanged={props.onSetArtifactDesign}/>;
    const parserConfigEditor =
        <ParserConfigEditor config={props.parserConfig} onValuesChanged={props.onSetParserConfig}/>;
    const customTextEditor =
        <CustomTextEditor customText={props.customMdText} onValuesChanged={props.onSetCustomMdText}/>;
    const otherAppConfigEditor =
        <OtherAppConfigEditor config={props.otherAppConfig} onValuesChanged={props.onSetOtherAppConfig}/>;

    const editorsMap: Map<string, React.JSX.Element> = new Map();
    editorsMap.set(RepositoryTagS, optionsRepositoryTagEditor);
    editorsMap.set(MAINTAINERS, maintainersEditor);
    editorsMap.set(REPOSITORY, repositoryInfoEditor);
    editorsMap.set(ACCOUNTS, accountsEditor);
    editorsMap.set(DESIGN, artifactDesignInformationEditor);
    editorsMap.set(PARSER, parserConfigEditor);
    editorsMap.set(CUSTOM_MD, customTextEditor);
    editorsMap.set(OTHER_APP_CONFIG, otherAppConfigEditor);

    const currentEditor = editorsMap.get(selectedEditor);

    return <div>
        {props.showElement && <Row>
            <Col span={24}>
                <Segmented options={EDITORS} onChange={(value) => setSelectedEditor(value.toString())}/>
                {currentEditor !== undefined ? currentEditor : <div></div>}
            </Col>
        </Row>}
    </div>;
};

export default EditorSelector;