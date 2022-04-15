import { useEffect } from 'react';

import { formatEther } from '@ethersproject/units';
import { useEtherBalance, useEthers } from '@usedappify/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import Identicon from '@/components/Wallet/Identicon';
// import { useRouter } from 'next/router';

declare let window: any;

// declare supportated chains
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 42, 56, 69, 250, 1337, 80001, 43114, 1666600000, 1666700000,
    1313161554, 1313161555,
  ],
});

export default function ConnectButton({
  handleOpenModal,
  DrawerMenu,
  accountId,
}: any) {
  const { activateBrowserWallet, account, activate } = useEthers();
  const etherBalance = useEtherBalance(account);
  // const [chainId, setChainid] = useState<any>();
  // const router = useRouter();

  function handleConnectWallet() {
    activateBrowserWallet();
    // console.log(account, active)
  }

  useEffect(() => {
    if (accountId) {
      console.log(accountId);
      // if (account === accountId)
      activate(injected);
    }

    async function getAccount() {
      const accounts = await window.ethereum.enable();
      const currAccount = accounts[0];
      // do something with new account here
      // console.log('Account ==> ', account);
      const chainId = window.ethereum.networkVersion;
      localStorage.setItem('chainid', chainId);
      // setChainid(chainId);
      localStorage.setItem('account', currAccount);
    }

    window.ethereum.on('accountsChanged', function () {
      getAccount();
    });

    if (account && account !== 'undefined') activate(injected);
    // console.log(account,injected)
  }, [account]);

  return account ? (
    <div className="flex justify-center items-center p-1 text-gray-700 bg-gray-900 rounded-xl">
      <div className="px-3">
        <span className="text-white text-md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)}{' '}
          {/* getCurrencyByChainId(chainId || 1) */ 'ETH'}
        </span>
      </div>
      <button onClick={handleOpenModal}>
        <a
          id="connect-wallet"
          className="px-3 m-1 bg-gray-800 hover:bg-gray-700 rounded-xl hover:border border-transparent hover:border-blue-400 hover:border-solid border-1px h-38"
        >
          <span className="font-semibold text-white text-md">
            {account &&
              `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length
              )}`}
          </span>
        </a>
      </button>
      <DrawerMenu className="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open user menu</span>
        <span className="w-8 h-8 rounded-full">
          <Identicon accountId={account} iconSize={32} />
        </span>
      </DrawerMenu>
    </div>
  ) : (
    <a
      href="#connect-button"
      className="p-1 py-2 px-3 text-sm font-medium text-white hover:text-white bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      onClick={handleConnectWallet}
    >
      Connect Wallet
    </a>
  );
}
