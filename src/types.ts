export interface WeakConfig {
  saveToFile?: boolean;
  rolling?: 'daily' | 'weekly' | 'monthly';
  timezone?: string;

  dateFormat?: string;
}

export type LogLevel = 'info' | 'debug' | 'error' | 'verbose' | 'warn';
