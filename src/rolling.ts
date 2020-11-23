import { CronJob } from "cron";
import { existsSync } from "fs";
import { err, std } from "./constant";
import { rename } from "./util";

export class Rolling {
  private rolling: "daily" | "weekly" | "monthly";
  private static instance: Rolling;
  private cronjob: CronJob = null;

  public static getInstance(): Rolling {
    if (!Rolling.instance) {
      Rolling.instance = new Rolling();
    }
    return Rolling.instance;
  }

  public roll(
    rolling: "daily" | "weekly" | "monthly",
    callback: Function,
    timezone?: string
  ) {
    if (this.cronjob === null) {
      this.rolling = rolling;
      new CronJob(
        this.getCronExpression(),
        () => {
          if (existsSync(std)) {
            rename("stdout", this.rolling);
          }

          if (existsSync(err)) {
            rename("stderr", this.rolling);
          }

          callback();
        },
        null,
        true,
        timezone
      );
    }
  }

  private getCronExpression() {
    if (this.rolling === "daily") return "0 0 * * *";
    else if (this.rolling === "weekly") return "0 0 * * 0";
    else return "0 0 1 * *";
  }
}

export default Rolling;
