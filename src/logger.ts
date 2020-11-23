import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import { createWriteStream, existsSync, mkdirSync, statSync, WriteStream } from 'fs';
import { EOL } from 'os';
import { colorize, white, yellow } from './colors';
import { basePath, err, std } from './constant';
import Rolling from './rolling';
import { IConfig, LogLevel } from './types';
import { convertToText, isOverDay, isOverMonth, isOverWeek, rename } from './util';

dayjs.extend(isBetween);
dayjs.extend(timezone);

export class Logger {
  private stdlog: WriteStream;
  private errlog: WriteStream;
  private saveToFile: boolean;
  private context: string;
  private config: IConfig;
  private dateFormat: string;

  constructor(config: IConfig) {
    this.config = config;
    const { saveToFile = false, rolling = 'daily', context = '', dateFormat = 'YYYY-MM-DD HH:mm:ss' } = config;
    this.context = context;
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

  private writeMessage(message: any, level: LogLevel, optionalParams: any[]) {
    const time = this.getTime();

    message = convertToText(message);
    optionalParams.forEach((row) => {
      message += '\t' + convertToText(row);
    });

    const color = colorize(level);
    const lvl = `[${level.toLocaleUpperCase()}]`;
    const context = yellow(`[${this.context}]`);

    const str = [color(lvl), white(time), context, color(message)];
    const pure = [lvl, time, context, message];

    if (this.saveToFile) {
      if (level === 'error') this.errlog.write(pure.join('\t') + EOL);
      else this.stdlog.write(pure.join('\t') + EOL);
    }

    console.log(str.join('\t'));
  }

  public info(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'info', optionalParams);
  }

  public debug(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'debug', optionalParams);
  }

  public error(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'error', optionalParams);
  }

  public verbose(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'verbose', optionalParams);
  }

  public warn(message: any, ...optionalParams: any[]) {
    this.writeMessage(message, 'warn', optionalParams);
  }

  private getTime() {
    return this.dateFormat === 'ISOString' ? dayjs().toISOString() : dayjs().format(this.dateFormat);
  }
}

export default Logger;
