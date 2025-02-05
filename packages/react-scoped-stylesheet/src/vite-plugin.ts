import postcss from "postcss";
import { getHashForFile, regexCssScopes, regexSassScopes } from "./utils";
import { type Plugin } from "vite";
import { createScopedStyles } from "./postcss-scoped-styles";

export function viteScopedStylesPlugin(): Plugin[] {
  return [
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