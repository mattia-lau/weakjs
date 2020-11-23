"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = exports.white = exports.cyan = exports.magenta = exports.yellow = exports.green = exports.blue = exports.black = exports.red = void 0;
var Reset = '\x1b[0m';
var FgBlack = '\x1b[30m';
var FgRed = '\x1b[31m';
var FgGreen = '\x1b[32m';
var FgYellow = '\x1b[33m';
var FgBlue = '\x1b[34m';
var FgMagenta = '\x1b[35m';
var FgCyan = '\x1b[36m';
var FgWhite = '\x1b[37m';
exports.red = function (text) {
    return "" + FgRed + text + Reset;
};
exports.black = function (text) {
    return "" + FgBlack + text + Reset;
};
exports.blue = function (text) {
    return "" + FgBlue + text + Reset;
};
exports.green = function (text) {
    return "" + FgGreen + text + Reset;
};
exports.yellow = function (text) {
    return "" + FgYellow + text + Reset;
};
exports.magenta = function (text) {
    return "" + FgMagenta + text + Reset;
};
exports.cyan = function (text) {
    return "" + FgCyan + text + Reset;
};
exports.white = function (text) {
    return "" + FgWhite + text + Reset;
};
exports.colorize = function (level) {
    if (level === 'info')
        return exports.green;
    else if (level === 'warn')
        return exports.yellow;
    else if (level === 'debug')
        return exports.blue;
    else if (level === 'error')
        return exports.red;
    else
        return exports.cyan;
};
