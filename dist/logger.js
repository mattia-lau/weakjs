"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var fs_1 = require("fs");
var os_1 = require("os");
var colors_1 = require("./colors");
var constant_1 = require("./constant");
var rolling_1 = __importDefault(require("./rolling"));
var util_1 = require("./util");
dayjs_1.default.extend(isBetween_1.default);
dayjs_1.default.extend(timezone_1.default);
var Logger = /** @class */ (function () {
    function Logger(config) {
        var _this = this;
        this.config = config;
        var _a = config.saveToFile, saveToFile = _a === void 0 ? false : _a, _b = config.rolling, rolling = _b === void 0 ? 'daily' : _b, _c = config.context, context = _c === void 0 ? '' : _c, _d = config.dateFormat, dateFormat = _d === void 0 ? 'YYYY-MM-DD HH:mm:ss' : _d;
        this.context = context;
        this.saveToFile = saveToFile;
        this.dateFormat = dateFormat;
        if (saveToFile) {
            this.init();
            rolling_1.default.getInstance().roll(rolling, function () {
                _this.init();
            }, config.timezone);
        }
    }
    Logger.prototype.rename = function (type) {
        if (fs_1.existsSync(type === 'stdout' ? constant_1.std : constant_1.err)) {
            var birthtime = fs_1.statSync(type === 'stdout' ? constant_1.std : constant_1.err).birthtime;
            if (util_1.isOverDay(birthtime) || util_1.isOverWeek(birthtime) || util_1.isOverMonth(birthtime)) {
                util_1.rename(type, this.config.rolling);
            }
        }
    };
    Logger.prototype.init = function () {
        if (!fs_1.existsSync(constant_1.basePath)) {
            fs_1.mkdirSync(constant_1.basePath);
        }
        if (this.saveToFile) {
            this.rename('stdout');
            this.rename('stderr');
        }
        this.stdlog = fs_1.createWriteStream(constant_1.std, { flags: 'a' });
        this.errlog = fs_1.createWriteStream(constant_1.err, { flags: 'a' });
    };
    Logger.prototype.writeMessage = function (message, level, optionalParams) {
        var time = this.getTime();
        message = util_1.convertToText(message);
        optionalParams.forEach(function (row) {
            message += '\t' + util_1.convertToText(row);
        });
        var color = colors_1.colorize(level);
        var lvl = "[" + level.toLocaleUpperCase() + "]";
        var context = colors_1.yellow("[" + this.context + "]");
        var str = [color(lvl), colors_1.white(time), context, color(message)];
        var pure = [lvl, time, context, message];
        if (this.saveToFile) {
            if (level === 'error')
                this.errlog.write(pure.join('\t') + os_1.EOL);
            else
                this.stdlog.write(pure.join('\t') + os_1.EOL);
        }
        console.log(str.join('\t'));
    };
    Logger.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.writeMessage(message, 'info', optionalParams);
    };
    Logger.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.writeMessage(message, 'debug', optionalParams);
    };
    Logger.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.writeMessage(message, 'error', optionalParams);
    };
    Logger.prototype.verbose = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.writeMessage(message, 'verbose', optionalParams);
    };
    Logger.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.writeMessage(message, 'warn', optionalParams);
    };
    Logger.prototype.getTime = function () {
        return this.dateFormat === 'ISOString' ? dayjs_1.default().toISOString() : dayjs_1.default().format(this.dateFormat);
    };
    return Logger;
}());
exports.Logger = Logger;
exports.default = Logger;
