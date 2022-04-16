import React, { useEffect, useState } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { useEthers } from '@usedappify/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { v4 as uuidv4 } from 'uuid';

import { Alert } from '@/components/Alerts';
import Identicon from '@/components/Wallet/Identicon';
import { Lock } from '@/layouts/Lock';
import { Meta } from '@/layouts/Meta';
import erc721abi from '@/lib/abis/erc721.json';
import { signText } from '@/utils/network';

// declare supportated chains
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 28, 42, 56, 69, 250, 1337, 80001, 43114, 1666600000, 1666700000,
    1313161554, 1313161555,
  ],
});

declare let window: any;

const REWARD_UNLOCK = gql`
  query GetReward($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      cid
      status
    }
  }
`;

const LockPage = (props: any) => {
  const [lock, setLock] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [content, setContent] = useState<string | boolean>(false);
  const [signature, setSignature] = useState<string | boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<string | boolean>(false);
  // const [fileExt, setFileExt] = useState("png");
  // const ref = useRef<any>();
  const { activateBrowserWallet, account } = useEthers();
  // const etherBalance = useEtherBalance(account);
  // const [chainId, setChainid] = useState<any>();
  // const router = useRouter();
  const { data, loading } = props;
  const [getLockReward, { data: reward }] = useLazyQuery(REWARD_UNLOCK);

  const abi = new Interface(erc721abi);
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
    setUnlocking(true);

    try {
      const result = await signText(message);

      if (result) {
        if (address && abi && provider) {
          erc721 = new Contract(address, abi, provider);
          erc721.currentTokenId().then(function (resultToken: any) {
            // console.log('Token ID ===> ', resultToken);
            if (resultToken) {
              const resultPlus = BigNumber.from(resultToken).toNumber() + 1;
              console.log('Token ID dec + 1 ===> ', resultPlus);
            }
          });

          // Get the token balance
          const tokenBalance = await erc721.balanceOf(account);
          // console.log('Token Balance: ', tokenBalance);
          if (tokenBalance) {
            const tokenBalanceDec = BigNumber.from(tokenBalance).toNumber();
            // console.log('Token Balance: ===> ', tokenBalanceDec);
            if (!tokenBalanceDec) {
              Alert(
                'error',
                'Permission Denied',
                'You do not own this NFT in this account address you are connected, please try again using another address.'
              );
              return false;
            }

            const fetchData = async () => {
              await getLockReward({
                variables: {
                  lockId: data?.api_locks[0].id || '',
                },
              });
            };
            fetchData();
            setUnlocked(reward?.api_locks[0].cid);
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

      console.log(
        JSON.stringify({
          id: 'm7NptX6T_euPIrt_KwwjgBmiOW-07tScgfW43wMceb0:mintships.mintspace2.testnet',
          did: `did:eth:${account}`,
          result,
        })
      );

      return result;
    } catch (error) {
      console.log(error);
      setUnlocking(false);
      setUnlocked(false);
      return false;
    }
  };

  useEffect(() => {
    if (signature && reward?.api_locks[0].cid) {
      window.location = reward.api_locks[0].cid;
      setUnlocking(false);
    }
  }, [signature, unlocked, reward]);

  useEffect(() => {
    // Connect to the Ethereum network
    const providerEth = new Web3Provider(window.ethereum, 'any');
    setProvider(providerEth);

    if (data && !loading) {
      setLock(data?.api_locks[0]);
    }
  }, [data, loading, content]);

  return (
    <Lock meta={<Meta title={lock?.name} description={lock?.description} />}>
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
                                className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-indigo-400 active:bg-indigo-900 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition duration-150 ease-in-out sm:mr-2 sm:text-xl text-md"
                                type="button"
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

                          <p className="mb-4 text-sm leading-relaxed text-gray-500 sm:text-md">
                            * Unlock this content by connecting your wallet to
                            verify you have required nft.
                          </p>
                        </div>
                      )}
                      {!account && (
                        <div className="px-4 w-full">
                          <div className="py-6 px-3 mt-0">
                            <button
                              className="inline-flex items-center py-2 px-12 mb-1 font-bold text-white uppercase bg-orange-400 active:bg-orange-900 rounded-full outline-none focus:outline-none shadow hover:shadow-lg transition-all duration-300 ease-linear sm:mr-2 sm:text-xl text-md"
                              type="button"
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
      </div>
    </Lock>
  );
};

export default LockPage;
