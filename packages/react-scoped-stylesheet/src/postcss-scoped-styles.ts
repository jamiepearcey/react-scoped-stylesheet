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
          const scopedAttr = `.${scopeClass}`;

          // Match :deep(<selector>) or :deep(selector)
          const deepMatch = sel.match(/:deep\((.*?)\)/);
          if (deepMatch) {
            const innerSelector = deepMatch[1].trim();
            return `${scopedAttr} ${innerSelector}`;
          }

          // Match other pseudo-classes like :hover, :active, etc.
          // const pseudoClassRegex = /:(hover|active|focus|visited|disabled|checked|first-child|last-child|nth-child|not|is|where|has|root|empty|target|first|last|only-child|link|lang|dir|scope|current|past|future|playing|paused|read-only|read-write|placeholder-shown|default|valid|invalid|in-range|out-of-range|required|optional|blank|user-invalid|enabled|indeterminate|any-link|local-link|nth-last-child|nth-of-type|nth-last-of-type|first-of-type|last-of-type|only-of-type|host|host-context|fullscreen|modal|picture-in-picture|autofill|defined|before|after|selection|marker|backdrop|placeholder|file-selector-button|first-letter|first-line|spelling-error|grammar-error|cue|cue-region|part|slotted|view-transition|view-transition-group|view-transition-image-pair|view-transition-old|view-transition-new)/g;
          
          const outOfScopeNestedSelector = `:not(${scopedAttr} [data-component], ${scopedAttr} [data-component] ${sel})`;
          const excludeNestedSelector = `${scopedAttr} ${sel}${outOfScopeNestedSelector}`;
          return `${excludeNestedSelector}`;
        }
 
        const selectors = rule.selector.split(',').map(s => getSelector(s));
        rule.selector = selectors.join(',');
      });
    }
  };
}

createScopedStyles.postcss = true;