import { ParsingConfiguration }        from "./models";
import { DefaultParsingConfiguration } from "./constatns";
import { isEmptyString }               from "../string_utils";
import logger                          from "../../logger";

const APP_CONFIG_KEY = "ApplicationParsingConfiguration";

export function loadAppConfiguration(): ParsingConfiguration {
    if (typeof window !== "undefined" && localStorage !== undefined) {
        const configString = localStorage.getItem(APP_CONFIG_KEY);
        logger.debug(configString, "loadAppConfiguration, configString from storage");

        if (isEmptyString(configString)) {
            logger.debug(configString, "loadAppConfiguration, configString is empty, default will be returned");
            logger.info({}, "DefaultParsingConfiguration will be returned");
            return DefaultParsingConfiguration;
        }
        try {
            const configParsed: ParsingConfiguration = JSON.parse(configString!);
            logger.debug(configParsed, "loadAppConfiguration, parsed ParsingConfiguration");
            logger.info({}, "Loaded ParsingConfiguration will be returned");
            return configParsed;
        } catch (e) {
            logger.warn(e, "loadAppConfiguration. Failed to load ParsingConfiguration, default will be returned");
            logger.info({}, "DefaultParsingConfiguration will be returned");
            return DefaultParsingConfiguration;
        }
    }
    return DefaultParsingConfiguration;
}

export function saveAppConfiguration(appConfig: ParsingConfiguration): void {
    if (typeof window !== "undefined" && localStorage !== undefined) {
        let stringConfig: string;
        logger.debug(appConfig, "saveAppConfiguration received appConfig");

        if (appConfig === undefined || appConfig === null) {
            stringConfig = JSON.stringify(DefaultParsingConfiguration);
        } else {
            stringConfig = JSON.stringify(appConfig);
        }

        localStorage.setItem(APP_CONFIG_KEY, stringConfig);
        logger.debug(stringConfig, "saveAppConfiguration has saved config");
    }
}