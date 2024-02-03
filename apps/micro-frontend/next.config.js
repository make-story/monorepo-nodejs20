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
    '@ysm/event-manager',
    '@ysm/fetch-manager',
    '@ysm/logging-manager',
    '@ysm/utils',
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
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack } =
      options;
    //if (!isServer) {
    //config.cache = false;
    /*config.plugins.push(
      new NextFederationPlugin({
        name: 'microfrontend',
        library: {
          type: config.output.libraryTarget || 'var',
          name: 'microfrontend',
        },
        //remotes: remotes(isServer),
        remotes: {},
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './home': path.resolve(
            __dirname,
            './src/service/components/test/Test.tsx',
          ),
          './pages-map': './pages-map.js',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
            eager: false,
            import: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
            eager: false,
            import: false,
          },
        },
        extraOptions: {
          debug: true, // `false` by default
          exposePages: true, // `false` by default
          enableImageLoaderFix: false, // `false` by default
          enableUrlLoaderFix: false, // `false` by default
          skipSharingNextInternals: false, // `false` by default
        },
      }),
    );*/
    //}

    return config;
  },
};

module.exports = nextConfig;
