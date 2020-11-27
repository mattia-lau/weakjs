import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
import { EOL } from 'os';
import { colorize, white, yellow } from './colors';
import { basePath, err, std } from './constant';
import Rolling from './rolling';
import { LogLevel, RollingPeriod, WeakConfig } from './types';
import { checkAndRename, convertToText } from './util';

dayjs.extend(isBetween);
dayjs.extend(timezone);

export class Logger {
  private stdlog: WriteStream;
  private errlog: WriteStream;

  private saveToFile: boolean;
  private dateFormat: string;
  private rolling: RollingPeriod;
  private maxNumberOfFiles: number;

  constructor(private readonly config?: WeakConfig) {
    this.config = config;
    const { saveToFile = false, rolling = 'daily', dateFormat = 'YYYY-MM-DD HH:mm:ss', maxNumberOfFiles = 7 } = config;
    this.saveToFile = saveToFile;
    this.dateFormat = dateFormat;
    this.rolling = rolling;
    this.maxNumberOfFiles = maxNumberOfFiles;

    if (saveToFile) {
      this.init();
      this.checkLogFileIsExisting();

      Rolling.getInstance().roll(
        maxNumberOfFiles,
        rolling,
        () => {
          this.init();
        },
        config.timezone,
      );
    }
  }

  private init() {
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }

    this.stdlog = createWriteStream(std, { flags: 'a' });
    this.errlog = createWriteStream(err, { flags: 'a' });
  }

  private checkLogFileIsExisting() {
    if (this.saveToFile) {
      checkAndRename('stdout', this.rolling);
      checkAndRename('stderr', this.rolling);
    }
  }

  private writeMessage(message: any, level: LogLevel, context?: string) {
    const time = this.getTime();

    message = convertToText(message);

    const color = colorize(level);
    const lvl = `[${level.toLocaleUpperCase()}]`;
    context = context ? `[${context}]` : null;
    const ctx = context ? yellow(context) : null;

    const str = [color(lvl), white(time), ctx, color(message)].filter((e) => e !== null);
    const pure = [lvl, time, context, message].filter((e) => e !== null);

    if (this.saveToFile) {
      if (level === 'error') this.errlog.write(pure.join('\t') + EOL);
      else this.stdlog.write(pure.join('\t') + EOL);
    }

    console.log(str.join('\t'));
  }

  public info(message: any, context?: string) {
    this.writeMessage(message, 'info', context);
  }

  public debug(message: any, context?: string) {
    this.writeMessage(message, 'debug', context);
  }

  public error(message: any, context?: string) {
    this.writeMessage(message, 'error', context);
  }

  public verbose(message: any, context?: string) {
    this.writeMessage(message, 'verbose', context);
  }

  public warn(message: any, context?: string) {
    this.writeMessage(message, 'warn', context);
  }

  private getTime() {
    return this.dateFormat === 'ISOString' ? dayjs().toISOString() : dayjs().format(this.dateFormat);
  }
}

export default Logger;
