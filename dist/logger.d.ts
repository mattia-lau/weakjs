import { IConfig } from './types';
export declare class Logger {
    private stdlog;
    private errlog;
    private saveToFile;
    private context;
    private config;
    private dateFormat;
    constructor(config: IConfig);
    private rename;
    private init;
    private writeMessage;
    info(message: any, ...optionalParams: any[]): void;
    debug(message: any, ...optionalParams: any[]): void;
    error(message: any, ...optionalParams: any[]): void;
    verbose(message: any, ...optionalParams: any[]): void;
    warn(message: any, ...optionalParams: any[]): void;
    private getTime;
}
export default Logger;
