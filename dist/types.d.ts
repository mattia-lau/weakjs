export interface IConfig {
    saveToFile: boolean;
    rolling?: 'daily' | 'weekly' | 'monthly';
    context?: string;
    timezone?: string;
    dateFormat?: string;
}
export declare type LogLevel = 'info' | 'debug' | 'error' | 'verbose' | 'warn';
