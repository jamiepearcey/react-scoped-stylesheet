"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const utils_1 = require("./utils");
function default_1(source) {
    const filePath = this.resourcePath;
    const hash = (0, utils_1.getHashForFile)(filePath);
    return `
${source};
export const scopeClass = "scoped-${hash}";
  `.trim();
}
