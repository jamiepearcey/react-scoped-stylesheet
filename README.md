# React Scoped Stylesheet

Vue-style scoped CSS for React. Write a stylesheet next to a component, import the generated scope class, and attach it to the component root. Selectors are rewritten at build time, so the browser receives ordinary CSS and pays no runtime matching cost.

```tsx
import scope from './Card.scoped.css'
import './Card.scoped.css'

export function Card() {
  return <article className={scope}>...</article>
}
```

```css
/* Card.scoped.css */
.title { color: #2563eb; }

/* Reach through a nested component deliberately. */
:deep(.third-party-button) { border-radius: 999px; }
```

## What it provides

- **Component-local selectors.** Rules are rooted at the imported scope class.
- **Natural CSS cascade.** Descendants can inherit ordinary parent styles.
- **Explicit deep selectors.** `:deep(...)` moves a selector below the scope boundary.
- **Parsed selectors.** Commas inside `:is()`, `:not()`, attributes, and other selector syntax are preserved.
- **Nested at-rules.** Rules in media, supports, and container queries are scoped.
- **No runtime library.** CSS transformation and scope-class generation happen during the build.
- **Next.js integration.** A single wrapper installs the stylesheet loader and SWC component tagging plugin.

## Installation

```sh
pnpm add react-scoped-stylesheet
# or: npm install react-scoped-stylesheet
```

The package currently supports Next.js 14+ and Vite 5/6 through the published PostCSS/loader pieces. The supported, tested integration is Next.js:

```ts
// next.config.ts
import { withNextScopedStyles } from 'react-scoped-stylesheet'

export default withNextScopedStyles({})
```

Add the package types once in the application:

```ts
// global.d.ts
/// <reference types="react-scoped-stylesheet/global" />
```

Name files with `.scoped.css`, `.scoped.scss`, or `.scoped.sass`. Import the stylesheet's default export and place it on the component root. A scoped stylesheet must have a root element carrying that class; the transformer cannot infer a root for a fragment or a portal.

## Selector semantics

A normal selector is rooted at the component scope:

```css
.button:hover { color: white; }
```

becomes the equivalent of:

```css
.scoped-xxxxxx .button:hover { color: white; }
```

`:deep()` is an explicit escape from the normal selector boundary:

```css
:deep(.nested .button) { ... }
```

becomes:

```css
.scoped-xxxxxx .nested .button { ... }
```

The implementation uses `postcss-selector-parser`, rather than splitting selector text on commas. Keyframes and declaration-only at-rules such as `@font-face` and `@property` are intentionally left untouched.

The scope identifier is derived from the stylesheet path. Keep the same project path mapping between the CSS transform and the stylesheet loader; moving a file changes its generated class and requires a rebuild.

## Repository layout

```text
packages/react-scoped-stylesheet/
  src/                 TypeScript plugin, loader, and selector transform
  crates/next-swc-tagging/  Rust SWC plugin compiled to WASM

demo/next-project/     Next.js showcase and Playwright fixtures
```

The SWC plugin adds component-root metadata used by the Next.js integration. The CSS transformation itself remains a build-time PostCSS step.

## Development

```sh
pnpm install
pnpm --filter react-scoped-stylesheet test -- --run
pnpm --filter react-scoped-stylesheet exec tsc --noEmit
pnpm --filter react-scoped-stylesheet build
pnpm --filter react-scoped-stylesheet test:e2e
```

Run the demo locally:

```sh
pnpm --dir demo/next-project dev
```

The demo is available at `http://localhost:3000` and shows local styles, nested components, and a `:deep()` override.

The package build requires Rust and the `wasm32-unknown-unknown` target. It writes the SWC artifact to the package's `target/` directory so the build remains correct when `CARGO_TARGET_DIR` is set elsewhere.

## Current boundaries

This package scopes CSS; it does not provide runtime style isolation or Shadow DOM. Anything that can inspect or modify the page's CSS can inspect or override the generated selectors. Portals render outside the component root and need their own scope class or an explicit global stylesheet. Fragment roots need a wrapper element if they use scoped CSS.

The package does not currently promise automatic support for every React rendering pattern, including dynamically generated root elements, third-party components that discard `className`, or CSS features that a particular PostCSS parser cannot represent. Add a fixture before relying on a new selector or framework integration.

## Contributing

Keep selector behavior covered by focused PostCSS fixtures and keep framework behavior covered by the demo/e2e suite. Changes to the generated class contract, `:deep()` semantics, or the SWC plugin should include a migration note in the pull request and an updated example.

## License

MIT. See [LICENSE](LICENSE).
