import { describe, it, expect, vi } from 'vitest';
import { viteScopedStylesPlugin } from './vite-plugin';
import type { Plugin } from 'vite';

describe('viteScopedStylesPlugin', () => {
  const plugins = viteScopedStylesPlugin();
  const prePlugin = plugins[0] as Plugin;
  const postPlugin = plugins[1] as Plugin;

  // Mock transform context
  const mockContext = {
    error: vi.fn(),
    warn: vi.fn()
  };

  describe('pre transform', () => {
    it('should transform scoped CSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.css';
      
      if (!prePlugin.transform) throw new Error('Transform hook not found');
      const result = await (prePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('color: red');
    });

    it('should transform scoped SCSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.scss';
      
      if (!prePlugin.transform) throw new Error('Transform hook not found');
      const result = await (prePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('color: red');
    });

    it('should not transform non-scoped files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.css';
      
      if (!prePlugin.transform) throw new Error('Transform hook not found');
      const result = await (prePlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });
  });

  describe('post transform', () => {
    it('should add scope class export for scoped CSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.css';
      
      if (!postPlugin.transform) throw new Error('Transform hook not found');
      const result = await (postPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('export const scopeClass =');
      expect(result.code).toContain('scoped-');
    });

    it('should add scope class export for scoped SCSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.scss';
      
      if (!postPlugin.transform) throw new Error('Transform hook not found');
      const result = await (postPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeTruthy();
      expect(result.code).toContain('export const scopeClass =');
      expect(result.code).toContain('scoped-');
    });

    it('should not transform non-scoped files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.css';
      
      if (!postPlugin.transform) throw new Error('Transform hook not found');
      const result = await (postPlugin.transform as any).call(mockContext, code, id);
      expect(result).toBeNull();
    });
  });
}); 