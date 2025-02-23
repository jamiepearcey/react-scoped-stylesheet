import postcss from "postcss";
import { type Plugin, type UserConfig, type UserConfigExport, type ConfigEnv, type PluginOption } from "vite";
import { createScopedStyles } from "./postcss-scoped-styles";
import pluginReactSwc from '@vitejs/plugin-react-swc'
import { createFilter } from "@rollup/pluginutils";
import { join, dirname } from "path";

interface Options {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

export function viteScopedStylesPlugin(options: Options = {}): Plugin {
  const cssFilter = createFilter(options.include || /\.(scoped|module)\.(css|scss|sass)$/, options.exclude);
  const jsxFilter = createFilter(/\.[jt]sx$/, options.exclude);

  return {
    name: "vite-scoped-styles",
    enforce: "pre",

    async transform(code: string, id: string) {
      if (cssFilter(id)) {
        const result = await postcss([createScopedStyles()]).process(code, {
          from: id,
          map: { inline: false },
        });

        return {
          code: result.css,
          map: result.map?.toString() || null,
        };
      }

      return null;
    },
  };
}

export function withViteScopedStyles(config: UserConfigExport = {}): UserConfigExport {
  return async (configEnv: ConfigEnv): Promise<UserConfig> => {
    const resolvedConfig = await (typeof config === 'function' ? config(configEnv) : config);

    // Create the React SWC plugin with our WASM transformer
    const swcPlugin = pluginReactSwc({
      plugins: [[join(__dirname, "..", "dist", "next-swc-tagging", "plugin.wasm"), {}]]
    });

    const userPlugins = (resolvedConfig.plugins || []) as PluginOption[];
    const filteredPlugins = userPlugins.filter(p => {
      if (!p || Array.isArray(p)) return true;
      if (typeof p === 'object' && 'name' in p) {
        return p.name !== 'vite:react-swc';
      }
      return true;
    });

    return {
      ...resolvedConfig,
      plugins: [
        // Put the SWC plugin first to handle JSX transformation
        swcPlugin,
        // Then our scoped styles plugin
        viteScopedStylesPlugin(),
        // Then any user plugins
        ...filteredPlugins,
      ],
      resolve: {
        ...resolvedConfig.resolve,
        preserveSymlinks: true
      },
      optimizeDeps: {
        ...resolvedConfig.optimizeDeps,
        include: [
          ...(resolvedConfig.optimizeDeps?.include || []),
          'react',
          'react-dom',
          'scheduler'
        ]
      }
    };
  };
}
