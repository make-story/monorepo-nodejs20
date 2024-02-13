/**
 * Next.js config
 * https://nextjs.org/docs/app/api-reference/next-config-js
 * https://nextjs.org/docs/app/api-reference/next-config-js/turbo
 * https://nextjs.org/docs/app/api-reference/next-config-js/webpack
 */
const path = require('node:path');
// @module-federation/nextjs-mf 활용하여 마이크로프론트 제공
const NextFederationPlugin = require('@module-federation/nextjs-mf');

const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    // specify remotes
    remote: `remote@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
  };
};

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, // https://nextjs.org/docs/architecture/nextjs-compiler
  transpilePackages: [
    '@makestory/event-manager',
    '@makestory/fetch-manager',
    '@makestory/logging-manager',
    '@makestory/utils',
  ],
  experimental: {
    modularizelmports: {
      /*lodash: {
        transform: 'lodash/{{member}}',
      },*/
    },
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (!isServer) {
      config.cache = false;
      /*config.plugins.push(
        new NextFederationPlugin({
          name: 'nextjs14',
          remotes: {},
          filename: 'static/chunks/remoteEntry.js',
          exposes: {},
          shared: {},
          extraOptions: {},
        }),
      );*/
    }
    return config;
  },
};

module.exports = nextConfig;
