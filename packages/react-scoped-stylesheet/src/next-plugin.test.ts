import { describe, it, expect } from 'vitest';
import { nextScopedStylesPlugin } from './next-plugin';
import type { Configuration } from 'webpack';
import { regexCssScopes, regexSassScopes } from './utils';

describe('nextScopedStylesPlugin', () => {
  const baseConfig: Configuration = {
    module: {
      rules: []
    }
  };

  const mockOptions = {
    webpackLoaderPath: '/mock/webpack-loader'
  };

  it('should add scoped styles loader configuration', () => {
    const config = nextScopedStylesPlugin(baseConfig, mockOptions);

    expect(config.module?.rules).toBeDefined();
    const rules = config.module?.rules as any[];
    const oneOfRule = rules.find(rule => 'oneOf' in rule);
    expect(oneOfRule).toBeDefined();

    const scopedRule = oneOfRule.oneOf[0];
    expect(scopedRule).toBeDefined();
    
    // Test the rule structure
    expect(scopedRule.sideEffects).toBe(true);
    expect(scopedRule.test).toEqual([regexCssScopes, regexSassScopes]);
    expect(scopedRule.use).toHaveLength(4);

    // Verify loader order and options
    const [webpackLoader, styleLoader, cssLoader, postcssLoader] = scopedRule.use;
    
    expect(webpackLoader.loader).toBe('/mock/webpack-loader');
    
    expect(styleLoader).toHaveProperty('loader');
    
    expect(cssLoader).toHaveProperty('loader');
    expect(cssLoader.options).toEqual({
      sourceMap: true,
      importLoaders: 1,
      modules: false
    });
    
    expect(postcssLoader).toHaveProperty('loader');
    expect(postcssLoader.options).toHaveProperty('postcssOptions');
    expect(postcssLoader.options.postcssOptions.plugins).toHaveLength(1);
  });

  it('should preserve existing webpack config', () => {
    const existingRule = {
      test: /\.txt$/,
      use: 'raw-loader'
    };

    const configWithExisting: Configuration = {
      ...baseConfig,
      module: {
        rules: [existingRule]
      }
    };

    const config = nextScopedStylesPlugin(configWithExisting, mockOptions);
    expect(config.module?.rules).toContainEqual(existingRule);
  });

  it('should add issuer conditions to exclude _app page', () => {
    const config = nextScopedStylesPlugin(baseConfig, mockOptions);
    const rules = config.module?.rules as any[];
    const oneOfRule = rules.find(rule => 'oneOf' in rule);
    const scopedRule = oneOfRule.oneOf[0];

    expect(scopedRule.issuer).toBeDefined();
    expect(scopedRule.issuer.and).toContainEqual(/\.(jsx|tsx|ts|js)$/);
    expect(scopedRule.issuer.not).toContainEqual(/pages[\\/]_app/);
  });
}); 