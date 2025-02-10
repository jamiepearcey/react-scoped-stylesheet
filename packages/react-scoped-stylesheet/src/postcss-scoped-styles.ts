import { type Plugin } from 'postcss';
import { getHashForFile } from './utils';

export function createScopedStyles(): Plugin {
  return {
    postcssPlugin: 'postcss-scoped-styles',
    Once(root) {
      const filePath = root.source?.input.file;
      if (!filePath) return;

      const hash = getHashForFile(filePath);
      const scopeClass = `scoped-${hash}`;

      root.walkRules(rule => {
        if (rule.parent?.type === 'atrule') return;

        const getSelector = (selector: string) => {
          const sel = selector.trim();
          const scopedAttr = `[style-scope="${scopeClass}"]`;
          const outOfScopeSelector = `:not([style-out-of-scope="true"] ${sel})`;
          return `${scopedAttr} ${sel}${outOfScopeSelector}`;
        }

        const selectors = rule.selector.split(',').map(s => getSelector(s));
        rule.selector = selectors.join(',');
      });
    }
  };
}

createScopedStyles.postcss = true;