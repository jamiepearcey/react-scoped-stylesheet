import { Configuration } from "webpack";
import { ConfigurationFn, regexCssScopes, regexSassScopes, unshiftLoader } from "./utils";
import { pipe } from "./utils";
import { createScopedStyles } from "./postcss-scoped-styles";
import type { Configuration as WebpackConfig } from "webpack";
import { join } from "path";
import { NextConfig } from "next/types";
import { WebpackConfigContext } from "next/dist/server/config-shared";

export interface NextScopedStylesPluginOptions {   
  webpackLoaderPath?: string;
}

export function nextScopedStylesPlugin(
  config: Configuration,
  options: NextScopedStylesPluginOptions = {}
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
              loader: options.webpackLoaderPath || require.resolve('./webpack-loader'),
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

export function withNextScopedStyles(nextConfig: NextConfig = {}): NextConfig {
  return {
    ...nextConfig,
    webpack: (config: WebpackConfig, options: WebpackConfigContext) => {
      // First run the user's webpack function if it exists
      const userWebpack = nextConfig.webpack;
      config = userWebpack ? userWebpack(config, options) : config;
      config = nextScopedStylesPlugin(config);
      return config;
    },
    experimental: {
      ...nextConfig.experimental,
      swcPlugins: [
        ...(nextConfig.experimental?.swcPlugins || []),
        [
          join(__dirname, "next-swc-tagging", "plugin.wasm"),
          {}
        ]
      ]
    }
  };
}
