export interface WeakConfig {
  saveToFile?: boolean;
  rolling?: RollingPeriod;
  timezone?: string;

  dateFormat?: string;
}

export type LogLevel = 'info' | 'debug' | 'error' | 'verbose' | 'warn';

export type RollingPeriod = 'daily' | 'weekly' | 'monthly';
