import { CronJob } from 'cron';
import { RollingPeriod } from './types';
import { checkAndRename } from './util';
export class Rolling {
  private rolling: RollingPeriod;
  private static instance: Rolling;
  private cronjob: CronJob = null;

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
          checkAndRename('stdout', this.rolling);
          checkAndRename('stderr', this.rolling);
          callback();
        },
        null,
        true,
        timezone,
      );
    }
  }

  private getCronExpression() {
    if (this.rolling === 'daily') return '0 0 * * *';
    else if (this.rolling === 'weekly') return '0 0 * * 0';
    else return '0 0 1 * *';
  }
}

export default Rolling;
