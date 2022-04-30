import React, { useEffect, useState } from 'react';

// import { gql, useLazyQuery } from '@apollo/client';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import Confetti from '@sekmet/react-confetti';
import useWindowSize from '@sekmet/react-use/lib/useWindowSize';
import { useEthers } from '@usedappify/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import BigNumber from 'bignumber.js';
import * as ethers from 'ethers';
import { v4 as uuidv4 } from 'uuid';

import { Alert } from '@/components/Alerts';
import Identicon from '@/components/Wallet/Identicon';
import { Lock } from '@/layouts/Lock';
import { Meta } from '@/layouts/Meta';
import erc20abi from '@/lib/abis/erc20.json';
import erc721abi from '@/lib/abis/erc721.json';
import { dataReward } from '@/lib/dataLock';
import { signText } from '@/utils/network';

// declare supportated chains
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 28, 42, 56, 69, 250, 1337, 80001, 43114, 1666600000, 1666700000,
    1313161554, 1313161555,
  ],
});

declare let window: any;

/* const REWARD_UNLOCK = gql`
  query GetReward($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      cid
      status
    }
  }
`; */

const LockPage = (props: any) => {
  const [lock, setLock] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [isAllowedChainId, setAllowedChainId] = useState<boolean>(true);
  const [content, setContent] = useState<string | boolean>(false);
  const [signature, setSignature] = useState<string | boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<string | boolean>(false);
  const [reward, setReward] = useState<any | boolean>(false);
  // const [fileExt, setFileExt] = useState("png");
  // const ref = useRef<any>();
  const { activateBrowserWallet, account } = useEthers();
  const { width, height } = useWindowSize();
  // const etherBalance = useEtherBalance(account);
  // const [chainId, setChainid] = useState<any>();
  // const router = useRouter();
  const { bg, data, loading } = props;
  // const [getLockReward, { data: reward }] = useLazyQuery(REWARD_UNLOCK);

  const abi721 = new Interface(erc721abi);
  const abi20 = new Interface(erc20abi);

  // This can be an address or an ENS name
  const address = data?.api_locks[0].contractAddress;
  const verifylockid = uuidv4();

  function handleConnectWallet() {
    activateBrowserWallet();
    // console.log(account, active)
  }

  const messageToSign = `To verify you own this particular NFT, please sign this message.\nThe NFT contract address is: ${address}\nThe verication ID is:\n ${verifylockid}`;

  const signMessage = async (message: string) => {
    let erc721: any = {};
    let erc20: any = {};
    setUnlocking(true);

    try {
      const result = await signText(message);

      if (result) {
        if (
          address &&
          abi721 &&
          provider &&
          data?.api_locks[0].lockType === 1
        ) {
          erc721 = new Contract(address, abi721, provider);
          // Get the token name
          const tokenName = await erc721.name();
          console.log('Token Name ===> ', tokenName);
          erc721.currentTokenId().then(function (resultToken: any) {
            console.log('Token ID ===> ', resultToken);
            // if (resultToken) {
            //  const resultPlus = BigNumber.from(resultToken).toNumber() + 1;
            //  console.log('Token ID dec + 1 ===> ', resultPlus);
            // }
          });

          // Get the token balance
          const tokenBalance = await erc721.balanceOf(account);
          // console.log('Token Balance: ', tokenBalance);
          if (tokenBalance) {
            const tokenBalanceDec = new BigNumber(tokenBalance).toNumber();
            // console.log('Token Balance: ===> ', tokenBalanceDec);
            if (!tokenBalanceDec) {
              Alert(
                'error',
                'Permission Denied',
                'You do not own this NFT in this account address you are connected, please try again using another address.'
              );
              setUnlocking(false);
              return false;
            }

            dataReward(data?.api_locks[0].id).then((xreward: any) => {
              setReward(xreward);
              setUnlocked(xreward?.api_locks[0].cid);
            });
          }
        }

        if (address && abi20 && provider && data?.api_locks[0].lockType === 4) {
          erc20 = new Contract(address, abi20, provider);
          // Get the token balance
          const tokenBalance = await erc20.balanceOf(account);
          console.log('Token Balance: ', tokenBalance);
          if (tokenBalance) {
            const tokenBalanceDec = new BigNumber(tokenBalance).toNumber();
            console.log('Token Balance: ===> ', tokenBalanceDec);
            if (!tokenBalanceDec) {
              Alert(
                'error',
                'Permission Denied',
                'You do not own this Token in this account address you are connected, please try again using another address.'
              );
              setUnlocking(false);
              return false;
            }

            dataReward(data?.api_locks[0].id).then((xreward: any) => {
              setReward(xreward);
              setUnlocked(xreward?.api_locks[0].cid);
            });
          }
        }

        setSignature(result);
      }
      // console.log(result);

      setContent(
        JSON.stringify({
          id: 'm7NptX6T_euPIrt_KwwjgBmiOW-07tScgfW43wMceb0:mintships.mintspace2.testnet',
          did: `did:eth:${account}`,
          result,
        })
      );

      /* console.log(
        JSON.stringify({
          id: 'm7NptX6T_euPIrt_KwwjgBmiOW-07tScgfW43wMceb0:mintships.mintspace2.testnet',
          did: `did:eth:${account}`,
          result,
        })
      ); */

      return result;
    } catch (error) {
      console.log(error);
      setUnlocking(false);
      setUnlocked(false);
      return false;
    }
  };

  const switchChain = async (chainId: number) => {
    console.log('Chain ID: ', chainId);
    // Get the chain ID
    const allowedChainIds = [data?.api_locks[0].chainId];

    /* eslint-disable no-underscore-dangle */
    if (
      window?.ethereum &&
      !allowedChainIds.includes(parseInt(window.ethereum.networkVersion, 10))
    ) {
      setAllowedChainId(false);
      // If not connected to allowed networks, request network switch
      if (allowedChainIds[0]) {
        try {
          const allowedChainId = ethers.utils.hexValue(allowedChainIds[0]);
          (async () =>
            window.ethereum.send('wallet_switchEthereumChain', [
              { chainId: allowedChainId },
            ]))();
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      setAllowedChainId(true);
    }
  };

  useEffect(() => {
    if (signature && reward && reward?.api_locks[0].cid) {
      setUnlocking(false);
      setTimeout(() => {
        window.location = reward.api_locks[0].cid;
      }, 6000);
    }
  }, [signature, unlocked, reward]);

  useEffect(() => {
    // Connect to the Ethereum network
    const providerEth = new Web3Provider(window.ethereum, 'any');
    setProvider(providerEth);

    // Get the chain ID
    const allowedChainIds = [data?.api_locks[0].chainId];

    /* eslint-disable no-underscore-dangle */
    if (
      window?.ethereum &&
      !allowedChainIds.includes(parseInt(window.ethereum.networkVersion, 10))
    ) {
      setAllowedChainId(false);
    } else {
      setAllowedChainId(true);
    }

    if (data && !loading) {
      setLock(data?.api_locks[0]);
    }
  }, [data, loading, content]);

  return (
    <Lock
      bg={bg}
      meta={<Meta title={lock?.name} description={lock?.description} />}
    >
      {!isAllowedChainId && lock?.chainId && (
        <div
          id="toast-warning"
          className="flex absolute top-0 right-0 z-50 items-center p-4 mt-3 mr-3 w-full max-w-xs text-white dark:text-gray-400 bg-orange-600 dark:bg-gray-800 rounded-lg shadow"
          role="alert"
        >
          <div className="inline-flex shrink-0 justify-center items-center w-8 h-8 text-orange-500 dark:text-orange-200 bg-orange-200 dark:bg-orange-700 rounded-lg">
            <svg
              className="w-10 h-10"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 text-sm font-bold">
            Please click to switch to the network chain {lock?.chainId} to
            continue.
          </div>
          <button
            type="button"
            onClick={() => switchChain(lock?.chainId)}
            className="inline-flex p-1 -m-1 ml-auto w-8 h-8 text-gray-400 hover:text-green-600 dark:text-gray-500 dark:hover:text-white bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-300"
            data-dismiss-target="#toast-warning"
            aria-label="Switch"
          >
            <span className="sr-only">Switch</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>
      )}

      {loading || !lock ? (
        <div
          id="loading-screen"
          className="block fixed top-0 left-0 z-50 w-full h-full bg-white opacity-90"
        >
          <span className="relative top-1/2 my-0 mx-auto w-0 h-0 text-blue-500 opacity-75">
            <div className="text-center">
              <svg
                role="status"
                className="inline mr-2 w-16 h-16 text-gray-200 dark:text-gray-600 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </span>
        </div>
      ) : (
        <div className="container px-4 mx-auto mt-12 h-full">
          <div className="flex justify-center content-center items-center h-full">
            <div className="px-4 w-full lg:w-6/12">
              <div className="flex relative flex-col w-full min-w-0 break-words">
                <div className="mb-0 rounded">
                  <div className="flex relative flex-col mb-6 w-full min-w-0 break-words bg-white rounded-lg shadow-xl">
                    <div className="px-6">
                      <div className="flex flex-wrap justify-center">
                        <div className="flex justify-center px-4 w-full lg:order-2 lg:w-3/12">
                          <div className="relative">
                            {lock?.thumbnailUrl ? (
                              <span className="absolute justify-center -m-16 -ml-20 h-auto align-middle rounded-full border-none shadow-xl lg:-ml-16 max-w-150-px">
                                <img
                                  alt={lock?.name}
                                  src={lock?.thumbnailUrl}
                                  className="rounded-full"
                                />
                              </span>
                            ) : (
                              <span className="absolute -m-16 -ml-20 h-auto align-middle rounded-full border-none shadow-xl lg:-ml-16 max-w-150-px">
                                <Identicon
                                  accountId={lock?.name}
                                  iconSize={128}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-24 text-center">
                        <h3 className="mb-2 text-3xl antialiased font-bold leading-normal first:text-gray-700 lg:text-4xl">
                          {lock?.name}
                        </h3>
                        {/* <div className="mt-0 mb-2 text-sm font-bold leading-normal uppercase text-blueGray-400">
                        <i className="mr-2 text-lg fas fa-map-marker-alt text-blueGray-400"></i>{' '}
                        Blockchain, Internet
                        </div> */}
                      </div>
                      <div className="py-5 mt-5 text-center border-t border-gray-200">
                        <div className="flex flex-wrap justify-center">
                          {!signature && (
                            <div className="px-4 w-full">
                              <p className="mb-4 leading-relaxed text-gray-700 sm:text-lg">
                                {lock?.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {account && (
                          <div className="px-4 w-full">
                            <div className="py-6 px-3 mt-0">
                              <span className="text-semibold">
                                Hello,{' '}
                                <strong className="text-xs">{account}</strong>
                              </span>
                            </div>

                            {!signature && !unlocking && (
                              <div className="py-6 px-3 mt-0">
                                <button
                                  className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-gray-400 hover:bg-blue-600 active:bg-blue-600 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition duration-150 ease-in-out sm:mr-2 sm:text-xl text-md"
                                  type="button"
                                  disabled={
                                    (!isAllowedChainId && lock?.chainId) ||
                                    loading
                                  }
                                  onClick={() => signMessage(messageToSign)}
                                >
                                  Sign to Unlock
                                </button>
                              </div>
                            )}

                            {!signature && unlocking && (
                              <div className="py-6 px-3 mt-0">
                                <button
                                  className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-red-400 active:bg-red-900 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition duration-150 ease-in-out cursor-not-allowed sm:mr-2 sm:text-xl text-md"
                                  type="button"
                                  disabled={true}
                                >
                                  <svg
                                    className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx={12}
                                      cy={12}
                                      r={10}
                                      stroke="currentColor"
                                      strokeWidth={4}
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Unlocking...
                                </button>
                              </div>
                            )}

                            {!unlocking && signature && reward && (
                              <div className="py-6 px-3 mt-0">
                                <button
                                  className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-green-400 active:bg-green-900 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition duration-150 ease-in-out sm:mr-2 sm:text-xl text-md"
                                  type="button"
                                  onClick={() => {
                                    window.location = reward.api_locks[0].cid;
                                  }}
                                >
                                  Unlocked!
                                </button>
                              </div>
                            )}

                            {!unlocking && signature && reward ? (
                              <p className="mb-4 text-sm font-bold leading-relaxed text-green-500 sm:text-md">
                                * Unlocked complete successfully, you will
                                redirected to the unlocked content in a few
                                seconds.
                              </p>
                            ) : (
                              <p className="mb-4 text-sm leading-relaxed text-gray-500 sm:text-md">
                                * Unlock this content by connecting your wallet
                                to verify you have required nft.
                              </p>
                            )}
                          </div>
                        )}
                        {!account && (
                          <div className="px-4 w-full">
                            <div className="py-6 px-3 mt-0">
                              <button
                                className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-gray-400 hover:bg-blue-600 active:bg-blue-600 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition duration-150 ease-in-out sm:mr-2 sm:text-xl text-md"
                                type="button"
                                disabled={
                                  (!isAllowedChainId && lock?.chainId) ||
                                  loading
                                }
                                onClick={
                                  account
                                    ? () => {
                                        window.location.reload();
                                      }
                                    : () => {
                                        handleConnectWallet();
                                      }
                                }
                              >
                                {account ? 'Disconnect' : 'Connect Wallet'}
                              </button>
                            </div>
                            <p className="mb-4 text-sm leading-relaxed text-gray-500 sm:text-md">
                              * Unlock this content by connecting your wallet to
                              verify you have required nft.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!unlocking && signature && reward && (
            <Confetti
              width={width}
              height={height}
              initialVelocityY={30}
              gravity={0.6}
            />
          )}
        </div>
      )}
    </Lock>
  );
};

export default LockPage;
