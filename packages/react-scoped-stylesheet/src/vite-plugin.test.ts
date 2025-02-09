import { describe, it, expect, vi } from 'vitest';
import { viteScopedStylesPlugin } from './vite-plugin';
import type { Plugin } from 'vite';

describe('viteScopedStylesPlugin', () => {
  const plugins = viteScopedStylesPlugin();
  const jsxPlugin = plugins[0] as Plugin;
  const cssPrePlugin = plugins[1] as Plugin;
  const cssPostPlugin = plugins[2] as Plugin;

  // Mock transform context
  const mockContext = {
    error: vi.fn(),
    warn: vi.fn()
  };

  describe('JSX transform plugin', () => {
    it('should transform JSX components with scoped styles', async () => {
      const code = `
        import { scopeClass } from './test.scoped.css';
        function MyComponent() {
          return <MyNestedComponent className={scopeClass}>Test</MyNestedComponent>;
        }
      `;
      const id = 'test.tsx';
      
      if (!jsxPlugin.transform) throw new Error('Transform hook not found');
      const result = await (jsxPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('<div className="out-of-scope"><MyNestedComponent');
    });

    it('should not transform JSX files without scoped styles', async () => {
      const code = `
        function MyComponent() {
          return <div className="regular-class">Test</div>;
        }
      `;
      const id = 'test.tsx';
      
      if (!jsxPlugin.transform) throw new Error('Transform hook not found');
      const result = await (jsxPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });

    it('should not transform non-JSX files', async () => {
      const code = 'const x = 1;';
      const id = 'test.js';
      
      if (!jsxPlugin.transform) throw new Error('Transform hook not found');
      const result = await (jsxPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });
  });

  describe('CSS pre transform', () => {
    it('should transform scoped CSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.css';
      
      if (!cssPrePlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPrePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('color: red');
    });

    it('should transform scoped SCSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.scss';
      
      if (!cssPrePlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPrePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('color: red');
    });

    it('should not transform non-scoped files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.css';
      
      if (!cssPrePlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPrePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });
  });

  describe('CSS post transform', () => {
    it('should add scope class export for scoped CSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.css';
      
      if (!cssPostPlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPostPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('export const scopeClass =');
      expect(result.code).toContain('scoped-');
    });

    it('should add scope class export for scoped SCSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.scss';
      
      if (!cssPostPlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPostPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('export const scopeClass =');
      expect(result.code).toContain('scoped-');
    });

    it('should not transform non-scoped files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.css';
      
      if (!cssPostPlugin.transform) throw new Error('Transform hook not found');
      const result = await (cssPostPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });
  });
}); 