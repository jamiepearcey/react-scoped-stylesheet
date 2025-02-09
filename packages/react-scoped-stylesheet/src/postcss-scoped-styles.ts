import { Plugin } from 'postcss';
import { getHashForFile } from './utils';

export function createScopedStyles(): Plugin {
  return {
    postcssPlugin: 'postcss-scoped-styles',
    Once(root) {
      const filePath = root.source?.input.file || 'unknown';
      const hash = getHashForFile(filePath);
      
      root.walkRules(rule => {
        if (rule.selector) {
          const selectors = rule.selector.split(',');

          const getSelector = (selector: string) => {
            const sel = selector.trim();
            const scopedAttr = `.scoped-${hash} `;
            const outOfScopeSelector = `:not(${scopedAttr} .out-of-scope ${sel}) `;
            return `${scopedAttr} ${sel}${outOfScopeSelector}`;
          }

          rule.selector = selectors
            .map(getSelector)
            .join(',');
        }
      });
    
    }
  };
}

createScopedStyles.postcss = true;