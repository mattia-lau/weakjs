import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import { createWriteStream, existsSync, mkdirSync, statSync, WriteStream } from 'fs';
import { EOL } from 'os';
import { colorize, white, yellow } from './colors';
import { basePath, err, std } from './constant';
import Rolling from './rolling';
import { WeakConfig, LogLevel } from './types';
import { convertToText, isOverDay, isOverMonth, isOverWeek, rename } from './util';

dayjs.extend(isBetween);
dayjs.extend(timezone);

export class Logger {
  private stdlog: WriteStream;
  private errlog: WriteStream;
  private saveToFile: boolean;
  private config: WeakConfig;
  private dateFormat: string;

  constructor(config: WeakConfig) {
    this.config = config;
    const { saveToFile = false, rolling = 'daily', dateFormat = 'YYYY-MM-DD HH:mm:ss' } = config;
    this.saveToFile = saveToFile;
    this.dateFormat = dateFormat;
    if (saveToFile) {
      this.init();
      Rolling.getInstance().roll(
        rolling,
        () => {
          this.init();
        },
        config.timezone,
      );
    }
  }

  private rename(type: 'stdout' | 'stderr') {
    if (existsSync(type === 'stdout' ? std : err)) {
      const { birthtime } = statSync(type === 'stdout' ? std : err);
      if (isOverDay(birthtime) || isOverWeek(birthtime) || isOverMonth(birthtime)) {
        rename(type, this.config.rolling);
      }
    }
  }

  private init() {
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
    if (this.saveToFile) {
      this.rename('stdout');
      this.rename('stderr');
    }

    this.stdlog = createWriteStream(std, { flags: 'a' });
    this.errlog = createWriteStream(err, { flags: 'a' });
  }

  private writeMessage(message: any, level: LogLevel, optionalParams: Record<string, unknown>) {
    const time = this.getTime();

    message = convertToText(message);

    const { context, ...other } = optionalParams;

    Object.values(other).forEach((row) => {
      message += '\t' + convertToText(row);
    });

    const color = colorize(level);
    const lvl = `[${level.toLocaleUpperCase()}]`;
    const ctx = context ? yellow(`[${context}]`) : null;

    const str = [color(lvl), white(time), ctx, color(message)].filter((e) => e !== null);
    const pure = [lvl, time, ctx, message].filter((e) => e !== null);

    if (this.saveToFile) {
      if (level === 'error') this.errlog.write(pure.join('\t') + EOL);
      else this.stdlog.write(pure.join('\t') + EOL);
    }

    console.log(str.join('\t'));
  }

  public info(message: any, optionalParams?: Record<string, unknown>) {
    this.writeMessage(message, 'info', optionalParams);
  }

  public debug(message: any, optionalParams?: Record<string, unknown>) {
    this.writeMessage(message, 'debug', optionalParams);
  }

  public error(message: any, optionalParams?: Record<string, unknown>) {
    this.writeMessage(message, 'error', optionalParams);
  }

  public verbose(message: any, optionalParams?: Record<string, unknown>) {
    this.writeMessage(message, 'verbose', optionalParams);
  }

  public warn(message: any, optionalParams?: Record<string, unknown>) {
    this.writeMessage(message, 'warn', optionalParams);
  }

  private getTime() {
    return this.dateFormat === 'ISOString' ? dayjs().toISOString() : dayjs().format(this.dateFormat);
  }
}

export default Logger;
