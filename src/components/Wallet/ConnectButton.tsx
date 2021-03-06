import { useEffect, useState } from 'react';

import { formatEther } from '@ethersproject/units';
import { useEtherBalance, useEthers } from '@usedappify/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useRouter } from 'next/router';

import Identicon from '@/components/Wallet/Identicon';
import { getCurrencyByChainId } from '@/utils';

declare let window: any;

// declare supportated chains
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 28, 42, 56, 69, 250, 1337, 80001, 43114, 1666600000, 1666700000,
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
  const [chainId, setChainid] = useState<any>();
  const router = useRouter();
  // const allowedChainIds = [1, 3, 4, 5, 42, 1337, 80001];

  function handleConnectWallet() {
    activateBrowserWallet();
    // console.log(account, active)
  }

  useEffect(() => {
    if (accountId) {
      // console.log(accountId);
      // if (account === accountId)
      activate(injected);
    }

    async function getAccount() {
      const accounts = await window.ethereum.enable();
      const currAccount = accounts[0];
      // do something with new account here
      // console.log('Account ==> ', account);
      localStorage.setItem('chainid', window.ethereum.networkVersion);
      setChainid(window.ethereum.networkVersion);
      localStorage.setItem('account', currAccount);
    }

    window.ethereum.on('accountsChanged', function () {
      getAccount();
      router.reload();
    });

    window.ethereum.on('networkChanged', function () {
      router.reload();
    });

    // console.log('allowedChainIds.includes(window.ethereum.networkVersion) ', window.ethereum.networkVersion, allowedChainIds.includes(parseInt(window.ethereum.networkVersion,10)) )

    /* eslint-disable no-underscore-dangle */
    /* if (
      window?.ethereum &&
      !allowedChainIds.includes(parseInt(window.ethereum.networkVersion, 10))
    ) {
      // If not connected to allowed networks, request network switch
      try {
        (async () =>
          window.ethereum.send('wallet_switchEthereumChain', [
            { chainId: '0x13881' },
          ]))();
      } catch (error) {
        console.log(error);
      }
    } */

    if (account && account !== 'undefined') activate(injected);
    // console.log(account,injected)
    getAccount();
  }, [account]);

  return account ? (
    <div className="flex justify-center items-center p-1 text-gray-700 bg-gray-900 rounded-xl">
      <div className="px-3">
        <span className="text-white text-md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)}{' '}
          {getCurrencyByChainId(
            chainId || parseInt(window.ethereum.networkVersion, 10) || 1
          )}
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
