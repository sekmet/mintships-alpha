const getNetworkProviders = (rpcProvider) => {
  const currentProviders = String(rpcProvider).split(',');
  if (currentProviders.length === 1) {
    return [rpcProvider];
  }
  return currentProviders;
};

/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  swcMinify: true,
  /* future: {
    webpack5: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  }, */
  env: {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    API_URL: process.env.API_URL || 'http://localhost:3000',
    INFURA_API_KEY: process.env.INFURA_API_KEY || '',
    GOERLI_NETWORK_PROVIDER: getNetworkProviders(
      process.env.GOERLI_NETWORK_PROVIDER
    ),
    MAINNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.MAINNET_NETWORK_PROVIDER
    ),
    KOVAN_NETWORK_PROVIDER: getNetworkProviders(
      process.env.KOVAN_NETWORK_PROVIDER
    ),
    ROPSTEN_NETWORK_PROVIDER: getNetworkProviders(
      process.env.ROPSTEN_NETWORK_PROVIDER
    ),
    RINKEBY_NETWORK_PROVIDER: getNetworkProviders(
      process.env.RINKEBY_NETWORK_PROVIDER
    ),
    MUMBAI_NETWORK_PROVIDER: getNetworkProviders(
      process.env.MUMBAI_NETWORK_PROVIDER
    ),
    POLYGON_NETWORK_PROVIDER: getNetworkProviders(
      process.env.POLYGON_NETWORK_PROVIDER
    ),
    HARMONYTESTNET0_NETWORK_PROVIDER: getNetworkProviders(
      process.env.HARMONYTESTNET0_NETWORK_PROVIDER
    ),
    HARMONY0_NETWORK_PROVIDER: getNetworkProviders(
      process.env.HARMONY0_NETWORK_PROVIDER
    ),
    FANTOMTESTNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.FANTOMTESTNET_NETWORK_PROVIDER
    ),
    FANTOM_NETWORK_PROVIDER: getNetworkProviders(
      process.env.FANTOM_NETWORK_PROVIDER
    ),
    CRONOS_NETWORK_PROVIDER: getNetworkProviders(
      process.env.CRONOS_NETWORK_PROVIDER
    ),
    CRONOSTESTNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.CRONOSTESTNET_NETWORK_PROVIDER
    ),
    FUJI_NETWORK_PROVIDER: getNetworkProviders(
      process.env.FUJI_NETWORK_PROVIDER
    ),
    AVALANCHE_NETWORK_PROVIDER: getNetworkProviders(
      process.env.AVALANCHE_NETWORK_PROVIDER
    ),
    AURORATESTNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.AURORATESTNET_NETWORK_PROVIDER
    ),
    AURORA_NETWORK_PROVIDER: getNetworkProviders(
      process.env.AURORA_NETWORK_PROVIDER
    ),
    MOONBASEALPHA_NETWORK_PROVIDER: getNetworkProviders(
      process.env.MOONBASEALPHA_NETWORK_PROVIDER
    ),
    MOONBEAM_NETWORK_PROVIDER: getNetworkProviders(
      process.env.MOONBEAM_NETWORK_PROVIDER
    ),
    MOONRIVER_NETWORK_PROVIDER: getNetworkProviders(
      process.env.MOONRIVER_NETWORK_PROVIDER
    ),
    BSCTESTNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.BSCTESTNET_NETWORK_PROVIDER
    ),
    BSC_NETWORK_PROVIDER: getNetworkProviders(process.env.BSC_NETWORK_PROVIDER),
    BOBATESTNET_NETWORK_PROVIDER: getNetworkProviders(
      process.env.BOBATESTNET_NETWORK_PROVIDER
    ),
    BOBA_NETWORK_PROVIDER: getNetworkProviders(
      process.env.BOBA_NETWORK_PROVIDER
    ),
    HASURA_SECRET: process.env.HASURA_SECRET || '',
    USE_WALLET_CONNECT: process.env.USE_WALLET_CONNECT || false,
    USE_COINBASE_WALLET: process.env.USE_COINBASE_WALLET || false,
    FORTMATIC_API_KEY: process.env.FORTMATIC_API_KEY || '',
    TWIT_CONSUMER_KEY: process.env.TWIT_CONSUMER_KEY || '',
    TWIT_CONSUMER_SECRET: process.env.TWIT_CONSUMER_SECRET || '',
    TWIT_ACCESS_TOKEN: process.env.TWIT_ACCESS_TOKEN || '',
    TWIT_ACCESS_TOKEN_SECRET: process.env.TWIT_ACCESS_TOKEN_SECRET || '',
  },
});
