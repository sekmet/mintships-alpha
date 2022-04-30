export function classNames(...classes: string[]): string | undefined {
  return classes.filter(Boolean).join(' ');
}

export function ellipsisAddress(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export function ellipsisAddressUrl(address: string) {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 13)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
}

export const getCurrencyByChainId = (chainId: string) => {
  let result: any | undefined;
  switch (String(chainId)) {
    case '1':
      result = 'ETH';
      break;
    case '3':
      result = 'ETH';
      break;
    case '4':
      result = 'ETH';
      break;
    case '5':
      result = 'ETH';
      break;
    case '42':
      result = 'ETH';
      break;
    case '28':
      result = 'ETH';
      break;
    case '288':
      result = 'ETH';
      break;
    case '56':
      result = 'BNB';
      break;
    case '97':
      result = 'BNB';
      break;
    case '137':
      result = 'MATIC';
      break;
    case '80001':
      result = 'MATIC';
      break;
    case '1284':
      result = 'GLMR';
      break;
    case '1285':
      result = 'MOVR';
      break;
    case '1287':
      result = 'DEV';
      break;
    case '250':
      result = 'FTM';
      break;
    case '4002':
      result = 'FTM';
      break;
    case '25':
      result = 'CRO';
      break;
    case '338':
      result = 'TCRO';
      break;
    case '43114':
      result = 'AVAX';
      break;
    case '43113':
      result = 'AVAX';
      break;
    case '1666600000':
      result = 'ONE';
      break;
    case '1666700000':
      result = 'ONE';
      break;
    case '1313161554':
      result = 'AETH';
      break;
    case '1313161555':
      result = 'AETH';
      break;

    default:
      throw Error('Unsupported network');
  }

  return result;
};

export const getNetworkNameByChainId = (chainId: string) => {
  let result: any | undefined;
  switch (String(chainId)) {
    case '1':
      result = 'ethereum';
      break;
    case '3':
      result = 'ropsten';
      break;
    case '4':
      result = 'rinkeby';
      break;
    case '5':
      result = 'goerli';
      break;
    case '42':
      result = 'kovan';
      break;
    case '28':
      result = 'boba-rinkeby';
      break;
    case '288':
      result = 'boba';
      break;
    case '56':
      result = 'bsc';
      break;
    case '97':
      result = 'bsc-testnet';
      break;
    case '1284':
      result = 'moonbeam';
      break;
    case '1285':
      result = 'moonriver';
      break;
    case '1287':
      result = 'moonbase';
      break;
    case '137':
      result = 'polygon';
      break;
    case '80001':
      result = 'mumbai';
      break;
    case '250':
      result = 'fantom-opera';
      break;
    case '4002':
      result = 'fantom-testnet';
      break;
    case '25':
      result = 'cronos-beta';
      break;
    case '338':
      result = 'cronos-testnet';
      break;
    case '43114':
      result = 'avalanche';
      break;
    case '43113':
      result = 'fuji';
      break;
    case '1666600000':
      result = 'harmony';
      break;
    case '1666700000':
      result = 'harmony-testnet';
      break;
    case '1313161554':
      result = 'aurora';
      break;
    case '1313161555':
      result = 'aurora-testnet';
      break;

    default:
      throw Error('Unsupported network');
  }

  return result;
};

export const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

export const getProviderByChainId = (chainId: string) => {
  let result: any | undefined;
  switch (chainId) {
    case '1':
      result = process.env.MAINNET_NETWORK_PROVIDER;
      break;
    case '3':
      result = process.env.ROPSTEN_NETWORK_PROVIDER;
      break;
    case '4':
      result = process.env.RINKEBY_NETWORK_PROVIDER;
      break;
    case '5':
      result = process.env.GOERLI_NETWORK_PROVIDER;
      break;
    case '42':
      result = process.env.KOVAN_NETWORK_PROVIDER;
      break;
    case '28':
      result = process.env.BOBATESTNET_NETWORK_PROVIDER;
      break;
    case '288':
      result = process.env.BOBA_NETWORK_PROVIDER;
      break;
    case '56':
      result = process.env.BSC_NETWORK_PROVIDER;
      break;
    case '97':
      result = process.env.BSCTESTNET_NETWORK_PROVIDER;
      break;
    case '137':
      result = process.env.POLYGON_NETWORK_PROVIDER;
      break;
    case '80001':
      result = process.env.MUMBAI_NETWORK_PROVIDER;
      break;
    case '1284':
      result = process.env.MOONBEAM_NETWORK_PROVIDER;
      break;
    case '1285':
      result = process.env.MOONRIVER_NETWORK_PROVIDER;
      break;
    case '1287':
      result = process.env.MOONBASEALPHA_NETWORK_PROVIDER;
      break;
    case '250':
      result = process.env.FANTOM_NETWORK_PROVIDER;
      break;
    case '4002':
      result = process.env.FANTOMTESTNET_NETWORK_PROVIDER;
      break;
    case '25':
      result = process.env.CRONOS_NETWORK_PROVIDER;
      break;
    case '338':
      result = process.env.CRONOSTESTNET_NETWORK_PROVIDER;
      break;
    case '43114':
      result = process.env.AVALANCHE_NETWORK_PROVIDER;
      break;
    case '43113':
      result = process.env.FUJI_NETWORK_PROVIDER;
      break;
    case '1666600000':
      result = process.env.HARMONY0_NETWORK_PROVIDER;
      break;
    case '1666700000':
      result = process.env.HARMONYTESTNET0_NETWORK_PROVIDER;
      break;
    case '1313161554':
      result = process.env.AURORA_NETWORK_PROVIDER;
      break;
    case '1313161555':
      result = process.env.AURORATESTNET_NETWORK_PROVIDER;
      break;

    default:
      result = 'Unsupported network';
      break;
    // throw Error('Unsupported network');
  }

  return result;
};

export const getNetworkByChainId = (chainId: string) => {
  let result: any | undefined;
  switch (String(chainId)) {
    case '1':
      result = {
        id: 1,
        name: 'Ethereum MainNet',
        thumbnail: '/assets/images/ETH.jpg',
      };
      break;
    case '3':
      result = 'ropsten';
      break;
    case '4':
      result = {
        id: 4,
        name: 'Ethereum Rinkeby',
        thumbnail: '/assets/images/ETH.jpg',
      };
      break;
    case '5':
      result = {
        id: 5,
        name: 'Ethereum Goerli',
        thumbnail: '/assets/images/ETH.jpg',
      };
      break;
    case '42':
      result = {
        id: 42,
        name: 'Ethereum Kovan',
        thumbnail: '/assets/images/ETH.jpg',
      };
      break;
    case '28':
      result = {
        id: 28,
        name: 'Boba Network Rinkeby Testnet',
        thumbnail: '/assets/images/boba.png',
      };
      break;
    case '288':
      result = {
        id: 288,
        name: 'Boba Network',
        thumbnail: '/assets/images/boba.png',
      };
      break;
    case '56':
      result = {
        id: 56,
        name: 'Binance Chain Mainnet',
        thumbnail: '/assets/images/binance.jpg',
      };
      break;
    case '97':
      result = {
        id: 97,
        name: 'Binance Chain Testnet',
        thumbnail: '/assets/images/binance.jpg',
      };
      break;
    case '137':
      result = {
        id: 137,
        name: 'Polygon Mainnet',
        thumbnail: '/assets/images/POLYGON.jpg',
      };
      break;
    case '80001':
      result = {
        id: 80001,
        name: 'Polygon Mumbai',
        thumbnail: '/assets/images/POLYGON.jpg',
      };
      break;
    case '250':
      result = {
        id: 250,
        name: 'Fantom Opera',
        thumbnail: '/assets/images/fantom.png',
      };
      break;
    case '4002':
      result = {
        id: 4002,
        name: 'Fantom Testnet',
        thumbnail: '/assets/images/fantom.png',
      };
      break;
    case '1284':
      result = {
        id: 1284,
        name: 'Moonbeam',
        thumbnail: '/assets/images/moonbeam.jpg',
      };
      break;
    case '1285':
      result = {
        id: 1285,
        name: 'Moonriver',
        thumbnail: '/assets/images/moonriver.png',
      };
      break;
    case '1287':
      result = {
        id: 1287,
        name: 'Moonbase Alpha',
        thumbnail: '/assets/images/moonbeam.png',
      };
      break;
    case '25':
      result = {
        id: 25,
        name: 'Cronos Mainnet Beta',
        thumbnail: '/assets/images/cronos.png',
      };
      break;
    case '338':
      result = {
        id: 338,
        name: 'Cronos Testnet',
        thumbnail: '/assets/images/cronos.png',
      };
      break;
    case '43114':
      result = {
        id: 43114,
        name: 'Avalanche',
        thumbnail: '/assets/images/avax.png',
      };
      break;
    case '43113':
      result = {
        id: 43113,
        name: 'Fuji Testnet',
        thumbnail: '/assets/images/avax.png',
      };
      break;
    case '1666600000':
      result = {
        id: 1666600000,
        name: 'Harmony S0',
        thumbnail: '/assets/images/harmony.jpg',
      };
      break;
    case '1666700000':
      result = {
        id: 1666700000,
        name: 'Harmony Testnet S0',
        thumbnail: '/assets/images/harmony.jpg',
      };
      break;
    case '1313161554':
      result = {
        id: 1313161554,
        name: 'Aurora',
        thumbnail: '/assets/images/aurora.jpg',
      };
      break;
    case '1313161555':
      result = {
        id: 1313161555,
        name: 'Aurora Testnet',
        thumbnail: '/assets/images/aurora.jpg',
      };
      break;

    default:
      throw Error('Unsupported network');
  }

  return result;
};

export function timeAgo(ms: number): string {
  let ago = Math.floor(ms / 1000);
  let part = 0;

  if (ago < 2) {
    return 'a moment ago';
  }
  if (ago < 5) {
    return 'moments ago';
  }
  if (ago < 60) {
    return `${ago} seconds ago`;
  }

  if (ago < 120) {
    return 'a minute ago';
  }
  if (ago < 3600) {
    while (ago >= 60) {
      ago -= 60;
      part += 1;
    }
    return `${part} minutes ago`;
  }

  if (ago < 7200) {
    return 'an hour ago';
  }
  if (ago < 86400) {
    while (ago >= 3600) {
      ago -= 3600;
      part += 1;
    }
    return `${part} hours ago`;
  }

  if (ago < 172800) {
    return 'a day ago';
  }
  if (ago < 604800) {
    while (ago >= 172800) {
      ago -= 172800;
      part += 1;
    }
    return `${part} days ago`;
  }

  if (ago < 1209600) {
    return 'a week ago';
  }
  if (ago < 2592000) {
    while (ago >= 604800) {
      ago -= 604800;
      part += 1;
    }
    return `${part} weeks ago`;
  }

  if (ago < 5184000) {
    return 'a month ago';
  }
  if (ago < 31536000) {
    while (ago >= 2592000) {
      ago -= 2592000;
      part += 1;
    }
    return `${part} months ago`;
  }

  if (ago < 1419120000) {
    // 45 years, approximately the epoch
    return 'more than year ago';
  }

  // TODO pass in Date.now() and ms to check for 0 as never
  return 'never';
}
