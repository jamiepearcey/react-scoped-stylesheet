"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexSassScopes = exports.regexCssScopes = exports.pipe = exports.plugin = exports.unshiftLoader = exports.loader = void 0;
exports.markRemovable = markRemovable;
exports.getHashForFile = getHashForFile;
const curry_1 = require("./curry");
const crypto_1 = require("crypto");
exports.loader = (0, curry_1.curry)(function loader(rule, config) {
    if (!config.module) {
        config.module = { rules: [] };
    }
    if (rule.oneOf) {
        const existing = config.module.rules?.find((arrayRule) => arrayRule && typeof arrayRule === 'object' && arrayRule.oneOf);
        if (existing && typeof existing === 'object') {
            existing.oneOf.push(...rule.oneOf);
            return config;
        }
    }
    config.module.rules?.push(rule);
    return config;
});
exports.unshiftLoader = (0, curry_1.curry)(function unshiftLoader(rule, config) {
    if (!config.module) {
        config.module = { rules: [] };
    }
    if (rule.oneOf) {
        const existing = config.module.rules?.find((arrayRule) => arrayRule && typeof arrayRule === 'object' && arrayRule.oneOf);
        if (existing && typeof existing === 'object') {
            existing.oneOf?.unshift(...rule.oneOf);
            return config;
        }
    }
    config.module.rules?.unshift(rule);
    return config;
});
exports.plugin = (0, curry_1.curry)(function plugin(p, config) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(p);
    return config;
});
function markRemovable(r) {
    Object.defineProperty(r, Symbol.for('__next_css_remove'), {
        enumerable: false,
        value: true,
    });
    return r;
}
const pipe = (...fns) => (param) => fns.reduce((result, next) => next(result), param);
exports.pipe = pipe;
function getHashForFile(filePath) {
    return (0, crypto_1.createHash)('md5')
        .update(filePath)
        .digest('hex')
        .slice(0, 6);
}
// RegExps for Scoped Style Sheets
exports.regexCssScopes = /\.scoped\.css$/;
exports.regexSassScopes = /\.scoped\.(scss|sass)$/;
