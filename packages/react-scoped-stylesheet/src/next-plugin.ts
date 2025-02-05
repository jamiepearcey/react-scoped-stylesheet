import { Configuration } from "webpack";
import { loader, markRemovable, regexCssScopes, regexSassScopes, unshiftLoader } from "./utils";
import { pipe } from "./utils";
import type { ConfigurationFn } from "./utils";
import { createScopedStyles } from "./postcss-scoped-styles";

export function nextScopedStylesPlugin(
  config: Configuration
): Configuration {
  const fns: ConfigurationFn[] = [];

  // Add our scoped styles loader
  fns.push(
    unshiftLoader({
      oneOf: [
        {
          sideEffects: true,
          test: [regexCssScopes, regexSassScopes],
          // Add issuer condition to allow import from any component
          issuer: {
            and: [/\.(jsx|tsx|ts|js)$/],
            not: [/pages[\\/]_app/]
          },
          use: [
            {
              loader: require.resolve('./webpack-loader'),
            },
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: false
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [createScopedStyles]
                }
              }
            },
          ]
        }
      ]
    })
  );

  const fn = pipe(...fns);
  return fn(config);
}