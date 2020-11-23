"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerRegister = void 0;
var logger_1 = __importDefault(require("./logger"));
var LoggerRegister = /** @class */ (function () {
    function LoggerRegister(config) {
        this.config = config;
        LoggerRegister.instance = this;
    }
    LoggerRegister.getInstance = function () {
        if (!LoggerRegister.instance) {
            throw Error("Not Yet Register");
        }
        return LoggerRegister.instance;
    };
    LoggerRegister.prototype.getLogger = function (context) {
        return new logger_1.default(__assign(__assign({}, this.config), { context: context }));
    };
    return LoggerRegister;
}());
exports.LoggerRegister = LoggerRegister;
