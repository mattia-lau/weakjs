import { CronJob } from 'cron';
import { existsSync, fstatSync, mkdirSync, openSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
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

  public roll(maxNumberOfFiles: number, rolling: RollingPeriod, callback: Function, timezone?: string) {
    if (this.cronjob === null) {
      this.rolling = rolling;
      new CronJob(
        this.getCronExpression(),
        () => {
          this.rename();
          this.removeExtraLogs(maxNumberOfFiles);
          callback();
        },
        null,
        true,
        timezone,
      );
    }
  }

  private removeExtraLogs(maxNumberOfFiles: number) {
    const files = readdirSync(basePath)
      .map((e) => ({ ...fstatSync(openSync(join(basePath, e), 'r')), filename: e }))
      .sort((a, b) => a.birthtime.getTime() - b.birthtime.getTime());

    // error and stdout
    const stdout = files.filter((e) => e.filename.indexOf('stdout') > -1);
    if (stdout.length > maxNumberOfFiles) {
      for (let i = maxNumberOfFiles; i < stdout.length; i++) {
        unlinkSync(join(basePath, stdout[i].filename));
      }
    }
    const stderr = files.filter((e) => e.filename.indexOf('stderr') > -1);
    if (stderr.length > maxNumberOfFiles) {
      for (let i = maxNumberOfFiles; i < stderr.length; i++) {
        unlinkSync(join(basePath, stderr[i].filename));
      }
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
