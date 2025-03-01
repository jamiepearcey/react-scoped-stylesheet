import { type Plugin } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { getHashForFile } from './utils';

const NON_SELECTOR_AT_RULES = new Set(['font-face', 'keyframes', '-webkit-keyframes', 'property', 'counter-style']);

function hasNonSelectorAncestor(rule: any): boolean {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === 'atrule' && NON_SELECTOR_AT_RULES.has(parent.name.toLowerCase())) return true;
    parent = parent.parent;
  }
  return false;
}

function scopeSelectorList(source: string, scopeClass: string): string {
  const processor = selectorParser(selectors => {
    selectors.each(selector => {
      const raw = String(selector).trim();
      if (!raw) return;
      const deep = raw.match(/:deep\((.*)\)$/s);
      if (deep) {
        selector.removeAll();
        selector.append(selectorParser.className({ value: scopeClass }));
        selector.append(selectorParser.combinator({ value: ' ' }));
        const deepSelector = selectorParser().astSync(deep[1]).nodes[0];
        deepSelector.nodes.forEach(node => selector.append(node));
      } else {
        while (selector.first?.type === 'combinator' && selector.first.value.trim() === '') {
          selector.first.remove();
        }
        selector.prepend(selectorParser.combinator({ value: ' ' }));
        selector.prepend(selectorParser.className({ value: scopeClass }));
      }
    });
  });
  return processor.processSync(source).replace(new RegExp(`\\.${scopeClass} +`, 'g'), `.${scopeClass} `);
}

export function createScopedStyles(): Plugin {
  return {
    postcssPlugin: 'postcss-scoped-styles',
    Once(root) {
      const filePath = root.source?.input.file;
      if (!filePath) return;

      const scopeClass = `scoped-${getHashForFile(filePath)}`;

      root.walkRules(rule => {
        if (hasNonSelectorAncestor(rule)) return;
        rule.selector = scopeSelectorList(rule.selector, scopeClass);
      });
    }
  };
}

createScopedStyles.postcss = true;
