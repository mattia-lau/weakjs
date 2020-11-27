import { Logger } from '../src/index';

const logger = new Logger({ saveToFile: true, maxNumberOfFiles: 7 });

logger.info({ a: 1, b: 2 });
logger.error(new Error("Test Error"), "ERROR")