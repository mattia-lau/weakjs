"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rolling = void 0;
var cron_1 = require("cron");
var fs_1 = require("fs");
var constant_1 = require("./constant");
var util_1 = require("./util");
var Rolling = /** @class */ (function () {
    function Rolling() {
        this.cronjob = null;
    }
    Rolling.getInstance = function () {
        if (!Rolling.instance) {
            Rolling.instance = new Rolling();
        }
        return Rolling.instance;
    };
    Rolling.prototype.roll = function (rolling, callback, timezone) {
        var _this = this;
        if (this.cronjob === null) {
            this.rolling = rolling;
            new cron_1.CronJob(this.getCronExpression(), function () {
                if (fs_1.existsSync(constant_1.std)) {
                    util_1.rename("stdout", _this.rolling);
                }
                if (fs_1.existsSync(constant_1.err)) {
                    util_1.rename("stderr", _this.rolling);
                }
                callback();
            }, null, true, timezone);
        }
    };
    Rolling.prototype.getCronExpression = function () {
        if (this.rolling === "daily")
            return "0 0 * * *";
        else if (this.rolling === "weekly")
            return "0 0 * * 0";
        else
            return "0 0 1 * *";
    };
    return Rolling;
}());
exports.Rolling = Rolling;
exports.default = Rolling;
