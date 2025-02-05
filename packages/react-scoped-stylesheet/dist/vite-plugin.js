"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viteScopedStylesPlugin = viteScopedStylesPlugin;
const postcss_1 = __importDefault(require("postcss"));
const utils_1 = require("./utils");
const postcss_scoped_styles_1 = require("./postcss-scoped-styles");
function viteScopedStylesPlugin() {
    return [
        {
            name: "vite-plugin-scoped-css-pre",
            enforce: "pre",
            async transform(code, id) {
                if (utils_1.regexCssScopes.test(id) || utils_1.regexSassScopes.test(id)) {
                    // Apply PostCSS with postcss-scoped-styles
                    const result = await (0, postcss_1.default)([(0, postcss_scoped_styles_1.createScopedStyles)()]).process(code, { from: id });
                    return {
                        code: result.css
                    };
                }
                return null;
            },
        },
        {
            name: "vite-plugin-scoped-css-post",
            enforce: "post", // Runs AFTER Vite's default CSS handling
            transform(code, id) {
                if (utils_1.regexCssScopes.test(id) || utils_1.regexSassScopes.test(id)) {
                    const hash = (0, utils_1.getHashForFile)(id);
                    const scopeClass = `scoped-${hash}`;
                    return {
                        code: `
${code}
export const scopeClass = "${scopeClass}";
            `.trim(),
                        map: null,
                    };
                }
                return null;
            },
        },
    ];
}
