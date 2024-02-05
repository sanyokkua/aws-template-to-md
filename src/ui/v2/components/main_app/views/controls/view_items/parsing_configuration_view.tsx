import React                        from "react";
import ParserConfiguration          from "./parsing_configuration_editors/parser_configuration";
import { Segmented }                from "antd";
import RepositoryInfoConfiguration  from "./parsing_configuration_editors/repository_info_configuration";
import RepositoryTagsConfiguration  from "./parsing_configuration_editors/repository_tag_configuration";
import RepositoryMaintainersConfig  from "./parsing_configuration_editors/repository_maintainers_config";
import AccountsConfiguration        from "./parsing_configuration_editors/accounts_configuration";
import DesignConfiguration          from "./parsing_configuration_editors/design_configuration";
import RelatedProjectsConfiguration from "./parsing_configuration_editors/related_projects_configuration";
import CustomMarkdownConfiguration  from "./parsing_configuration_editors/custom_markdown";
import {
    ACCOUNTS_CONFIGURATION,
    AVAILABLE_APP_CONFIGURATORS,
    CUSTOM_MARKDOWN_TEXT_CONFIGURATION,
    DESIGN_CONFIGURATION,
    OTHER_APP_CONFIG,
    PARSER_CONFIGURATION,
    RELATED_PROJECTS_CONFIGURATION,
    REPOSITORY_CONFIGURATION,
    REPOSITORY_MAINTAINERS_CONFIGURATION,
    REPOSITORY_TAGS_CONFIGURATION,
}                                   from "../../../../../../../core/config/constatns";
import { ParsingConfiguration }     from "../../../../../../../core/config/models";
import OtherAppConfigurations       from "./parsing_configuration_editors/other_app_configuration";
import logger                       from "../../../../../../../logger";

export type MainControlElementsProps = {
    showElement: boolean;
    parsingConfiguration: ParsingConfiguration;
    selectedEditor: string;
    onEditorChange: (editor: string) => void;
    onChange: (config: ParsingConfiguration) => void;
}

const PARSER_CONFIG = "parserConfig";
const REPOSITORY_INFO = "repositoryInfo";
const REPOSITORY_TAGS = "repositoryTags";
const REPOSITORY_MAINTAINERS = "repositoryMaintainers";
const DESIGN_INFORMATION = "designInformation";
const ACCOUNT_INFORMATION_LIST = "accountInformationList";
const RELATED_PROJECTS = "relatedProjects";
const CUSTOM_MARKDOWN_TEXT = "customMarkdownText";
const OTHER_APP_CONFIGURATION = "otherAppConfiguration";

const ParsingConfigurationView: React.FC<MainControlElementsProps> = (props: MainControlElementsProps) => {
    if (!props.showElement) {
        logger.debug(props.showElement, "ParsingConfigurationView, props.showElement, empty element will be returned");
        return <></>;
    }

    const currentParserConfig = props.parsingConfiguration.parserConfig;
    const currentRepoInfoConfig = props.parsingConfiguration.repositoryInfo;
    const currentRepoTagsConfig = props.parsingConfiguration.repositoryTags;
    const currentRepoMaintainersConfig = props.parsingConfiguration.repositoryMaintainers;
    const currentAccountsConfig = props.parsingConfiguration.accountInformationList;
    const currentDesignConfig = props.parsingConfiguration.designInformation;
    const currentRelatedProjectsConfig = props.parsingConfiguration.relatedProjects;
    const currentCustomMarkdownConfig = props.parsingConfiguration.customMarkdownText;
    const currentOtherAppConfig = props.parsingConfiguration.otherAppConfiguration;

    const onConfigUpdated = (fieldToUpdate: string, data: any) => {
        props.onChange({
                           ...props.parsingConfiguration,
                           [fieldToUpdate]: data,
                       });
        logger.debug({fieldToUpdate, data}, "ParsingConfigurationView, onConfigUpdated");
    };

    const getConfigurationComponent = (editor: string) => {
        logger.debug(editor, "ParsingConfigurationView, getConfigurationComponent, editor");
        switch (editor) {
            case PARSER_CONFIGURATION:
                return <ParserConfiguration config={currentParserConfig}
                                            onChange={(data) => onConfigUpdated(PARSER_CONFIG, data)}/>;
            case REPOSITORY_CONFIGURATION:
                return <RepositoryInfoConfiguration repositoryInfo={currentRepoInfoConfig}
                                                    onChange={(data) => onConfigUpdated(REPOSITORY_INFO, data)}/>;
            case REPOSITORY_TAGS_CONFIGURATION:
                return <RepositoryTagsConfiguration repositoryTags={currentRepoTagsConfig}
                                                    onChange={(data) => onConfigUpdated(REPOSITORY_TAGS, data)}/>;
            case REPOSITORY_MAINTAINERS_CONFIGURATION:
                return <RepositoryMaintainersConfig maintainers={currentRepoMaintainersConfig}
                                                    onChange={(data) => onConfigUpdated(REPOSITORY_MAINTAINERS,
                                                                                        data)}/>;
            case ACCOUNTS_CONFIGURATION:
                return <AccountsConfiguration accounts={currentAccountsConfig}
                                              onChange={(data) => onConfigUpdated(ACCOUNT_INFORMATION_LIST, data)}/>;
            case DESIGN_CONFIGURATION:
                return <DesignConfiguration designInfo={currentDesignConfig}
                                            onChange={(data) => onConfigUpdated(DESIGN_INFORMATION, data)}/>;
            case RELATED_PROJECTS_CONFIGURATION:
                return <RelatedProjectsConfiguration relatedProjects={currentRelatedProjectsConfig}
                                                     onChange={(data) => onConfigUpdated(RELATED_PROJECTS, data)}/>;
            case CUSTOM_MARKDOWN_TEXT_CONFIGURATION:
                return <CustomMarkdownConfiguration markdown={currentCustomMarkdownConfig}
                                                    onChange={(data) => onConfigUpdated(CUSTOM_MARKDOWN_TEXT, data)}/>;
            case OTHER_APP_CONFIG:
                return <OtherAppConfigurations config={currentOtherAppConfig}
                                               onChange={(data) => onConfigUpdated(OTHER_APP_CONFIGURATION, data)}/>;
        }
    };

    return <>
        <Segmented options={AVAILABLE_APP_CONFIGURATORS}
                   onChange={(value) => props.onEditorChange(value.toString())}/>
        {getConfigurationComponent(props.selectedEditor)}
    </>;
};

export default ParsingConfigurationView;