import { CronJob } from 'cron';
import { existsSync, mkdirSync } from 'fs';
import { basePath } from './constant';
import { RollingPeriod } from './types';
import { checkAndRename } from './util';
export class Rolling {
  private rolling: RollingPeriod;
  private static instance: Rolling;
  private cronjob: CronJob = null;

  constructor() {
    this.checkLogFolder();
    this.rename();
  }

  private checkLogFolder() {
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
  }

  public static getInstance(): Rolling {
    if (!Rolling.instance) {
      Rolling.instance = new Rolling();
    }
    return Rolling.instance;
  }

  public roll(rolling: RollingPeriod, callback: Function, timezone?: string) {
    if (this.cronjob === null) {
      this.rolling = rolling;
      new CronJob(
        this.getCronExpression(),
        () => {
          this.rename();
          callback();
        },
        null,
        true,
        timezone,
      );
    }
  }

  private rename() {
    checkAndRename('stdout', this.rolling);
    checkAndRename('stderr', this.rolling);
  }

  private getCronExpression() {
    if (this.rolling === 'daily') return '0 0 * * *';
    else if (this.rolling === 'weekly') return '0 0 * * 0';
    else return '0 0 1 * *';
  }
}

export default Rolling;
