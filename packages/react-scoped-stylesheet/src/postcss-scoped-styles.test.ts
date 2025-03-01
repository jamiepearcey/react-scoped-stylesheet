import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import { createScopedStyles } from './postcss-scoped-styles';
import { getHashForFile } from './utils';

async function transform(css: string) {
  return postcss([createScopedStyles()]).process(css, {
    from: '/project/Card.scoped.css',
  });
}

describe('postcss scoped styles', () => {
  it('scopes comma-separated and nested pseudo selectors without splitting their commas', async () => {
    const result = await transform('.card:is(.primary, .secondary), .card:hover { color: red }');
    const scope = `.scoped-${getHashForFile('/project/Card.scoped.css')}`;
    expect(result.css).toContain(`${scope} .card:is(.primary, .secondary)`);
    expect(result.css).toContain(`${scope} .card:hover`);
  });

  it('handles media rules while leaving keyframe selectors alone', async () => {
    const result = await transform('@media (min-width: 1px) { .card { color: red } } @keyframes fade { from { opacity: 0 } to { opacity: 1 } }');
    const scope = `.scoped-${getHashForFile('/project/Card.scoped.css')}`;
    expect(result.css).toContain(`${scope} .card`);
    expect(result.css).toContain('from { opacity: 0 }');
    expect(result.css).not.toContain(`${scope} from`);
  });

  it('moves a deep selector below the scope boundary', async () => {
    const result = await transform(':deep(.third-party .button) { color: red }');
    const scope = `.scoped-${getHashForFile('/project/Card.scoped.css')}`;
    expect(result.css).toContain(`${scope} .third-party .button`);
    expect(result.css).not.toContain(':deep');
  });
});
