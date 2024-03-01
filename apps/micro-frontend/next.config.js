/**
 * Next.js config
 * https://nextjs.org/docs/app/api-reference/next-config-js
 * https://nextjs.org/docs/app/api-reference/next-config-js/turbo
 * https://nextjs.org/docs/app/api-reference/next-config-js/webpack
 *
 * Next.js App 라우터에 대한 지원
 * https://github.com/module-federation/universe/pull/2002
 */
const path = require('node:path');
// @module-federation/nextjs-mf 활용하여 마이크로프론트 제공
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const packageJson = require('./package.json');

const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    // monorepo-nodejs20.git/apps/nextjs14
    remote: `remote@http://localhost:3000/_next/static/${location}/remoteEntry.js`, // React.lazy(() => import("remote/<내보내기 exposes 모듈명>"));
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
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack } =
      options;

    if (!isServer && !dev) {
      config.cache = false;
      config.plugins.push(
        new NextFederationPlugin({
          name: 'microfrontend',
          library: {
            type: config.output.libraryTarget || 'var',
            name: 'microfrontend',
          },
          filename: 'static/chunks/remoteEntry.js',
          // 원격 모듈 가져오기
          //remotes: remotes(isServer),
          remotes: {},
          // 내보낼 모듈
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
          // 옵션
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
    }

    return config;
  },
};

module.exports = nextConfig;
