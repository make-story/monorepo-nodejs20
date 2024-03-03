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
    // monorepo-nodejs20.git/apps/micro-frontend
    remote: `remote@http://localhost:8080/_next/static/${location}/remoteEntry.js`, // React.lazy(() => import("remote/<내보내기 exposes 모듈명>"));
  };
};

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true, // https://nextjs.org/docs/architecture/nextjs-compiler
  //output: 'standalone', // 운영환경 빌드 결과물만 별도 폴더로 모아둘 경우 standalone 설정
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
    //if (!isServer) {
    //config.cache = false;
    /*config.plugins.push(
      new NextFederationPlugin({
        name: 'nextjs14',
        filename: 'static/chunks/remoteEntry.js',
        // 원격 모듈 가져오기
        remotes: remotes(isServer),
        //remotes: {},
        // 내보낼 모듈
        exposes: {},
        // shared 를 설정하면, 호스트나 여러 원격 모듈에서 사용되는 공통된 패키지를 중복으로 불러오는 걸 방지
        shared: {},
        // 옵션
        extraOptions: {},
      }),
    );*/
    //}
    return config;
  },
};

module.exports = nextConfig;
