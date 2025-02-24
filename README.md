# React Scoped Stylesheet

**React Scoped Stylesheet** brings the power and simplicity of Vue's scoped styles to React. It's essentially CSS Modules, but where styles are naturally scoped to the component level using CSS classes and deep selectors. This avoids the need to manually scope every classname to the selector block.

## Key Features

- **Vue-Like Scoped Styles:**  
  Enjoy an intuitive, component-based styling experience inspired by Vue.

- **Selective Cascade:**  
  Retain the natural cascade of CSS—parent styles can cascade down to children—while keeping styles scoped to your component tree.

- **Deep Selector Support:**  
  Use `:deep()` selector to explicitly control style inheritance in nested components.

- **Flexible Scope Sharing:**  
  Get a unique scope identifier that you can pass around, enabling multiple components to share the same scoped styles.

- **Separation of Concerns:**  
  Keep your CSS in isolated stylesheets or preprocessors (SCSS, SASS) without tying them tightly to individual components.

- **Zero Runtime Overhead:**  
  All transformations happen at build time, so you get robust styling without impacting performance.

- **Next.js Integration:**  
  Seamlessly integrates with Next.js through a custom webpack configuration.

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

### Basic Usage

Import the scope reference from your scoped stylesheet and apply it to your component:

```jsx
import scopeRef from './Component.scoped.css';

function Component() {
  return <div className={scopeRef}>Scoped styles that cascade!</div>;
}
```

### Advanced: Using Deep Selectors

Use the `:deep()` selector to control style inheritance in nested components:

```css
/* Component.scoped.css */
.local-class {
  color: blue;
}

/* This style will apply to nested components */
:deep(.nested-component) {
  color: red;
}
```

```jsx
import scopeRef from './Component.scoped.css';

function Component() {
  return (
    <div className={scopeRef}>
      <div className="local-class">Locally scoped</div>
      <NestedComponent className="nested-component" />
    </div>
  );
}
```

### With Next.js

Configure your next.config.js/ts to use the plugin:

```typescript
import { withNextScopedStyles } from 'react-scoped-stylesheet';

const nextConfig = withNextScopedStyles({
  // Your existing Next.js config
});

export default nextConfig;
```

## How It Works

React Scoped Stylesheet processes your CSS at build time by:

1. Generating unique scope identifiers for each scoped stylesheet
2. Transforming selectors to be scoped to their component
3. Supporting `:deep()` selector for explicit style inheritance
4. Handling style propagation through CSS class inheritance

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