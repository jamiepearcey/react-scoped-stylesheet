import postcss from "postcss";
import { getHashForFile, isScopedStyle, regexCssScopes, regexSassScopes } from "./utils";
import { type Plugin, type TransformResult } from "vite";
import { createScopedStyles } from "./postcss-scoped-styles";
import { createFilter } from "@rollup/pluginutils";

export function viteScopedStylesPlugin(): Plugin[] {
  const jsFilter = createFilter(/\.(jsx|tsx)$/, /node_modules/);
  const importRegex = /import\s+([^'"]+)\s+from\s+['"]([^'"]+\.scoped\.(css|scss))['"];?/g;
  const jsxRegex = /<([A-Z][a-zA-Z0-9]*)([^>]*?)>/g;
  

  return [
    {
      name: "vite-plugin-scoped-jsx",
      enforce: "pre",
      async transform(code: string, id: string): Promise<TransformResult | null> {
        if (!jsFilter(id)) return null;

        // Find all scoped style imports
        const importedScopes = new Set<string>();
        let match;
        while ((match = importRegex.exec(code)) !== null) {
          const [, imports, path] = match;
          if (isScopedStyle(path)) {
            const name = imports.trim();
            if (name) importedScopes.add(name);
          }
        }

        if (importedScopes.size === 0) return null;

        // Find and modify JSX components that use scoped styles
        let modifiedCode = code;
        while ((match = jsxRegex.exec(code)) !== null) {
          const [fullMatch, componentName, props] = match;
          if (!/^[A-Z]/.test(componentName)) continue;

          // Only wrap components that have style-propagate
          if (props && !props.includes('style-propagate')) {
            const replacement = `<div style-out-of-scope="true">${fullMatch}</div>`;
            modifiedCode = modifiedCode.replace(fullMatch, replacement);
          }
        }

        if (modifiedCode === code) return null;

        return {
          code: modifiedCode,
          map: null
        };
      }
    },
    {
      name: "vite-plugin-scoped-css-pre",
      enforce: "pre",
      async transform(code: string, id: string) {
        if (isScopedStyle(id)) {
          // Apply PostCSS with postcss-scoped-styles
          const result = await postcss([createScopedStyles()]).process(code, { from: id });
          return {
            code: result.css,
            map: null
          };
        }
        return null;
      },
    },
    {
      name: "vite-plugin-scoped-css-post",
      enforce: "post",
      transform(code: string, id: string) {
        if (isScopedStyle(id)) {
          const hash = getHashForFile(id);
          const scopeClass = `scoped-${hash}`;

          return {
            code: `
${code}
export const scopeClass = "${scopeClass}";
export default "${scopeClass}";
            `.trim(),
            map: null,
          };
        }
        return null;
      },
    },
  ];
}