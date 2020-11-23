"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.std = exports.basePath = void 0;
var path_1 = require("path");
var root = '';
exports.basePath = path_1.join(root, 'logs');
exports.std = path_1.join(root, 'logs', 'stdout.log');
exports.err = path_1.join(root, 'logs', 'stderr.log');
