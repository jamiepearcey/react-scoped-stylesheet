import { describe, it, expect, vi } from 'vitest';
import { viteScopedStylesPlugin } from './vite-plugin';
import type { Plugin } from 'vite';

describe('viteScopedStylesPlugin', () => {
  const plugin = viteScopedStylesPlugin();

  // Mock transform context
  const mockContext = {
    error: vi.fn(),
    warn: vi.fn()
  };

  describe('transform', () => {
    it('should transform JSX components', async () => {
      const code = `
        import { scopeClass } from './test.scoped.css';
        function MyComponent() {
          return <div className={scopeClass}>Test</div>;
        }
      `;
      const id = 'test.tsx';
      
      const transformFn = plugin.transform as Function;
      const result = await transformFn.apply(mockContext, [code, id]);
      expect(result).toBeTruthy();
      expect(result!.code).toContain('data-component');
    });

    it('should transform scoped CSS files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.scoped.css';
      
      const transformFn = plugin.transform as Function;
      const result = await transformFn.apply(mockContext, [code, id]);
      expect(result).toBeTruthy();
      expect(result!.code).toContain('color: red');
    });

    it('should not transform non-scoped files', async () => {
      const code = '.test { color: red; }';
      const id = 'test.css';
      
      const transformFn = plugin.transform as Function;
      const result = await transformFn.apply(mockContext, [code, id]);
      expect(result).toBeNull();
    });
  });
}); 