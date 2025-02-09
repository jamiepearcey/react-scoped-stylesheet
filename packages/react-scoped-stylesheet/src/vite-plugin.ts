import postcss from "postcss";
import { getHashForFile, regexCssScopes, regexSassScopes } from "./utils";
import { type Plugin, type TransformResult } from "vite";
import { createScopedStyles } from "./postcss-scoped-styles";
import { createFilter } from "@rollup/pluginutils";

export function viteScopedStylesPlugin(): Plugin[] {
  const jsFilter = createFilter(/\.(jsx|tsx)$/, /node_modules/);
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+\.scoped\.(css|scss))['"];?/g;
  const jsxRegex = /<([A-Z][a-zA-Z0-9]*)([^>]*?)>/g;
  const classNameRegex = /className=["']([^"']+)["']/;

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
          if (path.endsWith('.scoped.css') || path.endsWith('.scoped.scss')) {
            imports.split(',').forEach(imp => {
              const name = imp.trim();
              if (name) importedScopes.add(name);
            });
          }
        }

        if (importedScopes.size === 0) return null;

        // Find and modify JSX components that use scoped styles
        let modifiedCode = code;
        while ((match = jsxRegex.exec(code)) !== null) {
          const [fullMatch, componentName, props] = match;
          if (!/^[A-Z]/.test(componentName)) continue;

          const replacement = `<div className="out-of-scope">${fullMatch}</div>`
          modifiedCode = modifiedCode.replace(fullMatch, replacement);

/*

          const classMatch = props.match(classNameRegex);
          if (!classMatch) continue;

          const classes = classMatch[1].split(' ');
          const hasScoped = classes.some(cls => importedScopes.has(cls));

          if (hasScoped) {
            const replacement = fullMatch.replace('>', ' data-out-of-scope="true">');
            modifiedCode = modifiedCode.replace(fullMatch, replacement);
          }

          */
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
      async transform(code, id) {
        if (regexCssScopes.test(id) || regexSassScopes.test(id)) {
          // Apply PostCSS with postcss-scoped-styles
          const result = await postcss([createScopedStyles()]).process(code, { from: id });

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
        if (regexCssScopes.test(id) || regexSassScopes.test(id)) {
          const hash = getHashForFile(id);
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