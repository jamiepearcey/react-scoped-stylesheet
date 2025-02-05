"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScopedStyles = createScopedStyles;
const utils_1 = require("./utils");
function createScopedStyles() {
    return {
        postcssPlugin: 'postcss-scoped-styles',
        Once(root) {
            const filePath = root.source?.input.file || 'unknown';
            const hash = (0, utils_1.getHashForFile)(filePath);
            root.walkRules(rule => {
                if (rule.selector) {
                    const selectors = rule.selector.split(',');
                    const scopedAttr = `.scoped-${hash}`;
                    rule.selector = selectors
                        .map(sel => `${scopedAttr} ${sel.trim()}`)
                        .join(',');
                }
            });
        }
    };
}
createScopedStyles.postcss = true;
