# React Scoped Stylesheet

**React Scoped Stylesheet** brings the power and simplicity of Vue's scoped styles to React—done right. It's essentially CSS Modules, but with the added benefits of natural CSS cascade and flexible style sharing. Say goodbye to the limitations of isolated styles that don't cascade and hello to a more intuitive, maintainable styling approach in React.

## Overview

In Vue, scoped styles just work, allowing you to encapsulate CSS without sacrificing the natural cascade of styles. React Scoped Stylesheet leverages this concept by processing your CSS at build time, adding a unique scope identifier to each stylesheet. This identifier (or class ID) is then returned for you to pass to one or more components as needed—enabling both component isolation and selective cascading.

> **Why?**  
> CSS Modules isolate styles completely, eliminating the cascade that often makes CSS so powerful. With React Scoped Stylesheet, you get the best of both worlds:
> - **Isolation:** Prevent style leakage to the global scope.
> - **Cascade:** Allow natural CSS inheritance within your component tree.
> - **Flexibility:** Share a scoped style across multiple components, giving you complete control over your styling architecture.

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

React Scoped Stylesheet processes your CSS at build time by appending a unique scope (or class ID) to your styles. This scope is then exported as scopeClass, allowing you to assign these styles to any component you choose. The result is a system that:

- **Encapsulates Styles:** Prevents unwanted style leakage.
- **Maintains Cascade:** Allows parent styles to cascade naturally to child elements.
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