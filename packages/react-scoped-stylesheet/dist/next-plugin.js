"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextScopedStylesPlugin = nextScopedStylesPlugin;
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const postcss_scoped_styles_1 = require("./postcss-scoped-styles");
function nextScopedStylesPlugin(config, options = {}) {
    const fns = [];
    // Add our scoped styles loader
    fns.push((0, utils_1.unshiftLoader)({
        oneOf: [
            {
                sideEffects: true,
                test: [utils_1.regexCssScopes, utils_1.regexSassScopes],
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
                                plugins: [postcss_scoped_styles_1.createScopedStyles]
                            }
                        }
                    },
                ]
            }
        ]
    }));
    const fn = (0, utils_2.pipe)(...fns);
    return fn(config);
}
