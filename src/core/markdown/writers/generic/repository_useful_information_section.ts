import { AdditionalConfigs, MarkdownWriterFunc }                          from "../common";
import { RepositoryInfo }                                                 from "../../../config/models";
import { mdAddStyleToText, mdCreateLink, mdMakeContentBlock, mdMakeList } from "../../utils";
import { MDTextStyle }                                                    from "../../constants";
import logger from "../../../../logger";

export const createRepositoryUsefulInformationSectionText: MarkdownWriterFunc<RepositoryInfo> = (dataValue: RepositoryInfo, additionalConfigs?: AdditionalConfigs): string => {
    if (dataValue === undefined || dataValue === null) {
        logger.debug({},
                     "createRepositoryUsefulInformationSectionText. dataValue is null and empty string will be returned");
        return "";
    }

    logger.debug({dataValue, additionalConfigs}, "createRepositoryUsefulInformationSectionText. input values");

    const branchingStrategy: string = dataValue.branchingStrategy ?? "";
    const programmingLang: string = dataValue.programmingLang ?? "";
    const programmingLangDoc: string = dataValue.programmingLangDoc ?? "";
    const deploymentDestination: string = dataValue.deploymentDestination ?? "";
    const deploymentTechnology: string = dataValue.deploymentTechnology ?? "";
    const deploymentTechnologyDocs: string = dataValue.deploymentTechnologyDocs ?? "";
    const linkToCloudForge: string = dataValue.linkToCloudForge ?? "";
    const ciCdTechnology: string = dataValue.ciCdTechnology ?? "";
    const ciCdDocumentation: string = dataValue.ciCdDocumentation ?? "";
    const ciCdBuildPage: string = dataValue.ciCdBuildPage ?? "";
    const ciCdDeployPage: string = dataValue.ciCdDeployPage ?? "";

    const listItems: string[] = [
        `Branching strategy: ${mdCreateLink(branchingStrategy, "link to description")}`,
        `Main programming language: ${mdCreateLink(programmingLangDoc, programmingLang)}`,
        `Artifact is deployed to: ${mdAddStyleToText(deploymentDestination, MDTextStyle.BOLD)}`,
        `Infrastructure Definition Technology:  ${mdCreateLink(deploymentTechnologyDocs, deploymentTechnology)}`,
        `CI/CD Tool: ${mdCreateLink(ciCdDocumentation, ciCdTechnology)}`,
        `CI/CD Build Pipeline Page: ${mdCreateLink(ciCdBuildPage, "link")}`,
        `CI/CD Deployment Pipeline Page: ${mdCreateLink(ciCdDeployPage, "link")}`,
        `Cloud Forge page: ${mdCreateLink(linkToCloudForge, "link")}`,
    ];

    const content = mdMakeList(listItems);

    return mdMakeContentBlock(content, "Essential Repository Information");
};