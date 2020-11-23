import { WeakConfig } from './types';
export declare class Logger {
    private stdlog;
    private errlog;
    private saveToFile;
    private config;
    private dateFormat;
    constructor(config: WeakConfig);
    private rename;
    private init;
    private writeMessage;
    info(message: any, optionalParams?: Record<string, unknown>): void;
    debug(message: any, optionalParams?: Record<string, unknown>): void;
    error(message: any, optionalParams?: Record<string, unknown>): void;
    verbose(message: any, optionalParams?: Record<string, unknown>): void;
    warn(message: any, optionalParams?: Record<string, unknown>): void;
    private getTime;
}
export default Logger;
