import React, { useState } from "react";
import { Segmented }       from "antd";

import MaintainersEditor     from "../editors/maintainers_editor";
import RepositoryInfoEditor  from "../editors/repository_info_editor";
import AccountsEditor        from "../editors/accounts_editor";
import ArtifactDesignEditor  from "../editors/artifact_design_editor";
import CustomTextEditor      from "../editors/custom_text_editor";
import {
    Account,
    ArtifactDesign,
    EditorInput,
    Maintainer,
    OtherAppConfig,
    ParserConfig,
    RelatedProjects,
    RepositoryInfo,
    RepositoryTag,
}                            from "../../../../md/writers/customs/models";
import RepositoryTagsEditor  from "../editors/repository_tag_editor";
import ParserConfigEditor    from "../editors/parser_config_editor";
import OtherAppConfigEditor  from "../editors/other_app_config_editor";
import RelatedProjectsEditor from "../editors/related_projects_editor";


const PARSER: string = "ParserConfig";
const REPOSITORY: string = "Repository";
const RepositoryTagS: string = "RepositoryTags";
const MAINTAINERS: string = "Maintainers";
const ACCOUNTS: string = "Accounts";
const DESIGN: string = "Design";
const RELATED_PROJECTS: string = "RelatedProjects";
const CUSTOM_MD: string = "CustomMD";
const OTHER_APP_CONFIG: string = "OtherAppConfig";

const EDITORS: string[] = [
    PARSER,
    REPOSITORY,
    RepositoryTagS,
    MAINTAINERS,
    ACCOUNTS,
    DESIGN,
    RELATED_PROJECTS,
    CUSTOM_MD,
    OTHER_APP_CONFIG,
];

export type EditorSelectorProps = {
    showElement: boolean;

    repositoryTags: EditorInput<RepositoryTag[]>;
    maintainers: EditorInput<Maintainer[]>
    repositoryInfo: EditorInput<RepositoryInfo>;
    accounts: EditorInput<Account[]>;
    artifactDesign: EditorInput<ArtifactDesign>;
    parserConfig: EditorInput<ParserConfig>;
    relatedProjects: EditorInput<RelatedProjects>;
    customMdText: EditorInput<string>;
    otherAppConfig: EditorInput<OtherAppConfig>;
}

const EditorSelector: React.FC<EditorSelectorProps> = (props: EditorSelectorProps) => {
    const [selectedEditor, setSelectedEditor] = useState<string>(EDITORS[0]);

    const optionsRepositoryTagEditor = <RepositoryTagsEditor editorInput={props.repositoryTags}/>;
    const maintainersEditor = <MaintainersEditor editorInput={props.maintainers}/>;
    const repositoryInfoEditor = <RepositoryInfoEditor editorInput={props.repositoryInfo}/>;
    const accountsEditor = <AccountsEditor editorInput={props.accounts}/>;
    const artifactDesignInformationEditor = <ArtifactDesignEditor editorInput={props.artifactDesign}/>;
    const parserConfigEditor = <ParserConfigEditor editorInput={props.parserConfig}/>;
    const relatedProjectsEditor = <RelatedProjectsEditor editorInput={props.relatedProjects}/>;
    const customTextEditor = <CustomTextEditor editorInput={props.customMdText}/>;
    const otherAppConfigEditor = <OtherAppConfigEditor editorInput={props.otherAppConfig}/>;

    const editorsMap: Map<string, React.JSX.Element> = new Map();
    editorsMap.set(RepositoryTagS, optionsRepositoryTagEditor);
    editorsMap.set(MAINTAINERS, maintainersEditor);
    editorsMap.set(REPOSITORY, repositoryInfoEditor);
    editorsMap.set(ACCOUNTS, accountsEditor);
    editorsMap.set(DESIGN, artifactDesignInformationEditor);
    editorsMap.set(PARSER, parserConfigEditor);
    editorsMap.set(RELATED_PROJECTS, relatedProjectsEditor);
    editorsMap.set(CUSTOM_MD, customTextEditor);
    editorsMap.set(OTHER_APP_CONFIG, otherAppConfigEditor);

    const currentEditor = editorsMap.get(selectedEditor);

    return <>
        {props.showElement && <>
            <Segmented options={EDITORS} onChange={(value) => setSelectedEditor(value.toString())}/>
            <br/>
            {currentEditor}
        </>}
    </>;
};

export default EditorSelector;