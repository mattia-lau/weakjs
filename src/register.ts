import { IConfig } from "./types";
import Logger from "./logger";

export class LoggerRegister {
    private config: IConfig;
    private static instance: LoggerRegister;
  
    constructor(config: IConfig) {
      this.config = config;
      LoggerRegister.instance = this;
    }
  
    public static getInstance(): LoggerRegister {
      if (!LoggerRegister.instance) {
        throw Error("Not Yet Register");
      }
      return LoggerRegister.instance;
    }
  
    public getLogger(context?: string): Logger {
      return new Logger({
        ...this.config,
        context
      });
    }
  }