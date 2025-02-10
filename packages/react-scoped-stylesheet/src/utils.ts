import { Configuration, RuleSetRule, WebpackPluginInstance } from "webpack";
import { curry } from "./curry";
import { createHash } from 'crypto';

export const loader = curry(function loader(
  rule: RuleSetRule,
  config: Configuration
) {
  if (!config.module) {
    config.module = { rules: [] }
  }

  if (rule.oneOf) {
    const existing = config.module.rules?.find(
      (arrayRule) =>
        arrayRule && typeof arrayRule === 'object' && arrayRule.oneOf
    )
    if (existing && typeof existing === 'object') {
      existing.oneOf!.push(...rule.oneOf)
      return config
    }
  }

  config.module.rules?.push(rule)
  return config
})

export const unshiftLoader = curry(function unshiftLoader(
  rule: RuleSetRule,
  config: Configuration
) {
  if (!config.module) {
    config.module = { rules: [] }
  }

  if (rule.oneOf) {
    const existing = config.module.rules?.find(
      (arrayRule) =>
        arrayRule && typeof arrayRule === 'object' && arrayRule.oneOf
    )
    if (existing && typeof existing === 'object') {
      existing.oneOf?.unshift(...rule.oneOf)
      return config
    }
  }

  config.module.rules?.unshift(rule)
  return config
})

export const plugin = curry(function plugin(
  p: WebpackPluginInstance,
  config: Configuration
) {
  if (!config.plugins) {
    config.plugins = []
  }
  config.plugins.push(p)
  return config
})

export function markRemovable(r: RuleSetRule): RuleSetRule {
  Object.defineProperty(r, Symbol.for('__next_css_remove'), {
    enumerable: false,
    value: true,
  })
  return r
}


export type ConfigurationContext = {
  // If the `appDir` feature is enabled
  hasAppDir: boolean
  // If the current rule matches a resource in the app layer
  isAppDir?: boolean
  supportedBrowsers: string[] | undefined
  rootDirectory: string
  customAppFile: RegExp | undefined

  isDevelopment: boolean
  isProduction: boolean

  isServer: boolean
  isClient: boolean
  isEdgeRuntime: boolean
  targetWeb: boolean

  assetPrefix: string

  sassOptions: any
  productionBrowserSourceMaps: boolean
  serverSourceMaps: boolean

  transpilePackages: any

  future: any
  experimental: any
}

export type ConfigurationFn = (
  a: Configuration
) => Configuration

export const pipe =
  <R>(...fns: Array<(a: R) => R>) =>
  (param: R) =>
    fns.reduce(
      (result: R, next) => next(result),
      param
    )

export function getHashForFile(filePath: string): string {
  return createHash('md5')
    .update(filePath)
    .digest('hex')
    .slice(0, 6);
}

// RegExps for Scoped Style Sheets
export const regexCssScopes = /\.scoped\.css$/;
export const regexSassScopes = /\.scoped\.(scss|sass)$/;
export const isScopedStyle = (filePath: string) => regexCssScopes.test(filePath) || regexSassScopes.test(filePath);
