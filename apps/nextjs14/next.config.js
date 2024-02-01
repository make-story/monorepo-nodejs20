const nextConfig = {
  reactStrictMode: false, 
  swcMinify: true, // https://nextjs.org/docs/architecture/nextjs-compiler
  transpilePackages: [
    '@ysm/event-manager',
    '@ysm/fetch-manager',
    '@ysm/logging-manager',
    '@ysm/utils',
  ],
  compiler: {
    styledComponents: true, 
  },
};

module.exports = nextConfig;
