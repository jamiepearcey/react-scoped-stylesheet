# React Scoped Stylesheet

**React Scoped Stylesheet** brings the power and simplicity of Vue's scoped styles to React. It's essentially CSS Modules, but where styles are naturally scoped to the component level, and you can share styles across components by passing the scope identifier. This avoids the need to manually scope every classname to the selector block.

## Key Features

- **Vue-Like Scoped Styles:**  
  Enjoy an intuitive, component-based styling experience inspired by Vue.

- **Selective Cascade:**  
  Retain the natural cascade of CSS—parent styles can cascade down to children—while keeping styles scoped to your component tree.

- **Flexible Scope Sharing:**  
  Get a unique scope identifier that you can pass around, enabling multiple components to share the same scoped styles.

- **Separation of Concerns:**  
  Keep your CSS in isolated stylesheets or preprocessors (SCSS, SASS) without tying them tightly to individual components.

- **Zero Runtime Overhead:**  
  All transformations happen at build time, so you get robust styling without impacting performance.

- **Modern Tooling Integration:**  
  Seamlessly integrates with popular build tools such as Vite and Next.js.

## Installation

Install via npm, yarn, or pnpm:

```bash
# Using npm
npm install react-scoped-stylesheet

# Using yarn
yarn add react-scoped-stylesheet

# Using pnpm
pnpm add react-scoped-stylesheet
```

## Usage

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-pwgg39gp?file=src%2FApp.tsx)

### Basic Usage

Import the scopeClass from your scoped stylesheet and apply it to your component:

```jsx
import { scopeClass } from './Component.scoped.css';

function Component() {
  return <div className={scopeClass}>Scoped styles that cascade!</div>;
}
```

### Advanced: Sharing Scoped Styles

Import the scopeClass from your scoped stylesheet and pass the classname to components that share a scope:

```jsx
// ParentComponent.scoped.css returns a scopeClass
import { scopeClass } from './ParentComponent.scoped.css';

function ParentComponent() {
  return (
    <>
        <div className={scopeClass}>
            <div>My styles cascade!</div>
        </div>
        <ChildComponent scope={scopeClass} />
    </>
  );
}
```

### With Vite

Add the plugin to your vite.config.ts:

```jsx
import { defineConfig } from 'vite';
import { scopedStylesPlugin as viteScopedStylesPlugin } from 'react-scoped-stylesheet';

export default defineConfig({
  plugins: [
    viteScopedStylesPlugin()
  ]
});
```

### With Next.js

Configure your next.config.js to use the custom loader:

```jsx

import { nextScopedStylesPlugin } from 'react-scoped-stylesheet';

module.exports = {
  webpack: (config, options) => {
    return nextScopedStylesPlugin(config);
  },
};
```

## How It Works

React Scoped Stylesheet processes your CSS at build time by appending a unique scope to your styles.

- **Encapsulates Styles:** Prevents unwanted style leakage.
- **Avoids Manually Bunding:** Each class in a component does not need to be explicitly imported from the stylesheet.
- **Enhances Flexibility:** Enables style reuse across components by simply passing the scope identifier.

## Development

To set up the project locally for development:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm build
```

## Contributing

Contributions are always welcome! If you encounter any issues or have ideas for improvements:

- **Report Issues:** Open a GitHub issue detailing the problem.
- **Submit Pull Requests:** Fork the repository, make your changes, and open a pull request.

Your contributions help make React Scoped Stylesheet even better!

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## About

React Scoped Stylesheet was built to provide a robust and flexible styling solution for React developers. Inspired by the effortless experience of Vue's scoped styles and addressing the shortcomings of traditional CSS Modules, this tool allows you to write maintainable, scalable CSS that feels natural.

Explore the repository, open issues, and join the community to help drive the project forward. Happy coding!