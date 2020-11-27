export interface WeakConfig {
  saveToFile?: boolean;
  rolling?: RollingPeriod;
  timezone?: string;

  dateFormat?: string;
  maxNumberOfFiles?: number;
}

export type LogLevel = 'info' | 'debug' | 'error' | 'verbose' | 'warn';

export type RollingPeriod = 'daily' | 'weekly' | 'monthly';
