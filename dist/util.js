"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToText = exports.rename = exports.isOverMonth = exports.isOverWeek = exports.isOverDay = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var fs_1 = require("fs");
var path_1 = require("path");
var constant_1 = require("./constant");
exports.isOverDay = function (birthtime) {
    return dayjs_1.default().diff(birthtime, 'day') >= 1;
};
exports.isOverWeek = function (birthtime) {
    var start = dayjs_1.default(birthtime).startOf('week');
    var end = dayjs_1.default(birthtime).endOf('week');
    var now = dayjs_1.default();
    return !now.isBetween(start, end);
};
exports.isOverMonth = function (birthtime) {
    return dayjs_1.default(birthtime).toDate().getMonth() !== new Date().getMonth();
};
exports.rename = function (type, rolling) {
    var filename;
    var birthtime = fs_1.statSync(type === 'stdout' ? constant_1.std : constant_1.err).birthtime;
    switch (rolling) {
        case 'daily':
            filename = type + "." + dayjs_1.default(birthtime).format('YYYY-MM-DD') + ".log";
            break;
        case 'weekly':
            filename = type + "." + dayjs_1.default(birthtime).startOf('week').format('YYYY-MM-DD') + ".log";
            break;
        case 'monthly':
            filename = type + "." + dayjs_1.default(birthtime).format('YYYY-MM') + ".log";
            break;
    }
    fs_1.renameSync(path_1.join(constant_1.basePath, type + ".log"), path_1.join(constant_1.basePath, filename));
};
exports.convertToText = function (obj) {
    var string = [];
    if (obj instanceof Error) {
        var err_1 = obj;
        string.push(err_1.message, '\t', err_1.stack);
    }
    else if (typeof obj == 'object' && obj.join == undefined) {
        string.push('{');
        for (var prop in obj) {
            string.push(prop, ': ', exports.convertToText(obj[prop]), ', ');
        }
        if (Object.keys(obj).length > 0)
            string.splice(string.length - 1, 1);
        string.push('}');
    }
    else if (typeof obj == 'object' && !(obj.join == undefined)) {
        string.push('[');
        for (var prop in obj) {
            string.push(exports.convertToText(obj[prop]), ', ');
        }
        string.splice(string.length - 1, 1);
        string.push(']');
    }
    else if (typeof obj == 'function') {
        string.push(obj.toString());
    }
    else {
        string.push(JSON.stringify(obj));
    }
    return string.join('');
};
