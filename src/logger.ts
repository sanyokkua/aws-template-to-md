import pino, { Logger } from "pino";


const logger: Logger = pino({level: "info"});

export default logger;