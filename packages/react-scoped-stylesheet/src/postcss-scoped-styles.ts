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