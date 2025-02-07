import type { NextConfig } from "next";
import { nextScopedStylesPlugin } from "react-scoped-stylesheet";

const nextConfig: NextConfig = {
  webpack: (config, options) => {
    return nextScopedStylesPlugin(config);
  },
};

export default nextConfig;