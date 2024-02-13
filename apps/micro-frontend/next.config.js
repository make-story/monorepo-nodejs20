/**
 * Next.js config
 * https://nextjs.org/docs/app/api-reference/next-config-js
 * https://nextjs.org/docs/app/api-reference/next-config-js/turbo
 * https://nextjs.org/docs/app/api-reference/next-config-js/webpack
 */
const path = require('node:path');
// @module-federation/nextjs-mf 활용하여 마이크로프론트 제공
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const packageJson = require('./package.json');

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
    '@makeapi/event-manager',
    '@makeapi/fetch-manager',
    '@makeapi/logging-manager',
    '@makeapi/utils',
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

    /*if (!isServer && !dev) {
      config.cache = false;
      config.plugins.push(
        // https://github.com/module-federation/universe/pull/2002
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
          // shared 를 설정하면, 호스트나 여러 원격 모듈에서 사용되는 공통된 패키지를 중복으로 불러오는 걸 방지
          shared: {
            //...packageJson.dependencies,
          },
          extraOptions: {
            //debug: true, // `false` by default
            //exposePages: true, // `false` by default
            //enableImageLoaderFix: true, // `false` by default
            //enableUrlLoaderFix: true, // `false` by default
            //automaticAsyncBoundary: true, // `false` by default
            //skipSharingNextInternals: false, // `false` by default
          },
        }),
      );
    }*/

    return config;
  },
};

module.exports = nextConfig;
