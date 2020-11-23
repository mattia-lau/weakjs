import { IConfig } from "./types";
import Logger from "./logger";
export declare class LoggerRegister {
    private config;
    private static instance;
    constructor(config: IConfig);
    static getInstance(): LoggerRegister;
    getLogger(context?: string): Logger;
}
