import { useEffect, useState, useRef } from 'react';

import { useMutation } from '@apollo/client';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { RadioGroup } from '@headlessui/react';
import {
  CheckCircleIcon,
  BadgeCheckIcon,
  BanIcon,
} from '@heroicons/react/solid';
import { ImageUpload } from '@sekmet/react-ipfs-uploader';
import { useEthers } from '@usedappify/core';
// import { BigNumber } from '@ethersproject/bignumber';
import { create as ipfsHttpClient } from 'ipfs-http-client';
// import { Base64 } from 'js-base64';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/Alerts';
import NetworkDropdown from '@/components/Dropdowns/NetworkDropdown';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import erc1155abi from '@/lib/abis/erc1155.json';
import erc20abi from '@/lib/abis/erc20.json';
import erc721abi from '@/lib/abis/erc721.json';
import EXPLORE_LOCKS from '@/services/graphql/locks.query';
import CREATELOCK from '@/services/graphql/newlock.mutation';
import {
  classNames,
  getNetworkByChainId,
  getCurrencyByChainId,
  getProviderByChainId,
  getRandomElement,
} from '@/utils';

/* eslint-disable-next-line unused-imports/no-unused-vars */
declare let window: any;

const lockingTypes = [
  {
    id: 1,
    title: 'NFT Ownership',
    description:
      'Require a ownership of a particular (ERC721 or ERC1155) NFT to unlock the content',
  },
  {
    id: 2,
    title: 'Pay to unlock',
    description:
      'Require a payment of specific amount in order to unlock the content',
  },
  {
    id: 3,
    title: 'Retweet to unlock',
    description:
      'Require a retweet of specific tweet in order to unlock the content',
  },
  {
    id: 4,
    title: 'Token Ownership',
    description:
      'Require a ownership of a particular (ERC20) token to unlock the content',
  },
];

const ipfsOptions: any = 'https://ipfs.infura.io:5001/api/v0';
const ipfs = ipfsHttpClient(ipfsOptions);

const Index = () => {
  const router = useRouter();
  const { account } = useEthers();
  const [selectedLockingTypes, setSelectedLockingTypes] = useState<any>(
    lockingTypes[0]
  );
  const [fileOrLink, setFileOrLink] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const [ipfsThumbUrl, setIpfsThumbUrl] = useState<string>();
  // const [networkId, setNetworkId] = useState<string>();
  // const [cidUrl, setCidUrl] = useState<string>();
  const [ipfsCidUrl, setIpfsCidUrl] = useState<string>();
  const [file, setFile] = useState<any>(false);
  const [fileUrl, setFileUrl] = useState<string>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);

  const [contractStatus, setContractStatus] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [contractVerified, setContractVerified] = useState<boolean>(false);
  const [contractName, setContractName] = useState<string | boolean>(false);
  const [contractAddress, setContractAddress] = useState<string | boolean>(
    false
  );
  // const [providerRpcUrl, setProviderRpcUrl] = useState<string>();
  const [chainId, setChainId] = useState<string>();

  const inputFile: any = useRef(null);

  const setLockContentSource = (e: any, value: number) => {
    e.preventDefault();
    setFileOrLink(value);
  };

  const [createUserLock, { loading }] = useMutation(CREATELOCK, {
    refetchQueries: [
      {
        query: EXPLORE_LOCKS, // DocumentNode object parsed with gql
        variables: {
          userId: account || '',
          offset: 0,
          limit: 30,
        },
      },
    ],
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    cUrl: string;
    chainId: number;
    cid: string;
    contentMimeType: string;
    contractAddress: string;
    description: string;
    tweetUnlock: string;
    walletAddress: string;
    paymentUnlockAmount: number;
    lockType: number;
    name: string;
    network: string;
    secretKey: string;
    status: number;
    thumbnailUrl: string | undefined;
    timeoutHours: number;
    tokenId: number;
    userId: string;
  }>({ reValidateMode: 'onChange' });

  const onSubmit = async (data: any) => {
    // get network information
    const network = await getNetworkByChainId(String(chainId));

    const lockData: any = {};
    lockData.lockType = selectedLockingTypes.id;
    lockData.chainId = chainId || network.id;
    lockData.network = network.name;
    lockData.thumbnailUrl = ipfsThumbUrl || data.thumbnailUrl;
    lockData.cid = ipfsCidUrl || data.cid;
    lockData.userId = account;
    lockData.status = 1;

    const mergedItem = Object.assign(data, lockData);
    // console.log({ ...mergedItem });

    await createUserLock({
      variables: { lock: { ...mergedItem } },
    });

    // console.log(updateLockedResult);
    if (!loading) {
      Alert(
        'success',
        'New Lock Created!',
        'New content lock created successfully...'
      );
      router.push('/');
    }
  };

  const verifyTokenContract = async (
    providerRpcUrl: string,
    currentContractAddress: string
  ) => {
    if (currentContractAddress?.length === 42 && !contractVerified) {
      setIsVerifying(true);
      setContractVerified(true);
      try {
        let erc20: any = {};
        const provider = await new JsonRpcProvider(providerRpcUrl);
        const abi = new Interface(erc20abi);
        // setValue('contractAddress', contractAddress);
        // console.log('contractAddress', currentContractAddress, providerRpcUrl);
        // This can be an address or an ENS name
        const address = `${currentContractAddress}`.toLowerCase();
        if (address && abi && provider) {
          erc20 = await new Contract(address, abi, provider);
          // Get the token name
          const tokenName = await erc20.name();
          const tokenSymbol = await erc20.symbol();
          const tokenDecimals = await erc20.decimals();
          const tokenSupply = await erc20.totalSupply();
          // console.log('Token Symbol ===> ', tokenSymbol);
          // console.log('Token Name ===> ', tokenName);
          // console.log('Token Decimals ===> ', tokenDecimals);
          // console.log('Total Supply ===> ', tokenSupply);
          if (tokenName && tokenSymbol && tokenDecimals && tokenSupply) {
            setContractName(tokenName);
            setContractStatus(true);
            setContractVerified(false);
            setIsVerifying(false);
          }
        }
      } catch (error) {
        console.log('Error ===> ', error);
        setContractStatus(false);
        setContractVerified(false);
        setIsVerifying(false);
      }
    }
  };

  const verifyNftContract = async (
    providerRpcUrl: string,
    currentContractAddress: string
  ) => {
    if (currentContractAddress?.length === 42 && !contractVerified) {
      setIsVerifying(true);
      setContractVerified(true);
      try {
        let erc721: any = {};
        const provider = await new JsonRpcProvider(providerRpcUrl);
        const abi721 = new Interface(erc721abi);
        // setValue('contractAddress', contractAddress);
        // console.log('contractAddress', currentContractAddress, providerRpcUrl);
        // This can be an address or an ENS name
        const address = `${currentContractAddress}`.toLowerCase();

        if (address && abi721 && provider) {
          erc721 = await new Contract(address, abi721, provider);
          // Get the token name
          const tokenName = await erc721.name();
          const tokenExists = await erc721.ownerOf(1);
          console.log('Token 721 Name ===> ', tokenName);
          console.log('Token 721 info ===> ', tokenExists);
          if (tokenName && tokenExists) {
            setContractName(tokenName);
            setContractStatus(true);
            setContractVerified(false);
            setIsVerifying(false);
            return;
          }
        }
      } catch (error) {
        console.log('Error ===> ', error);
        setContractStatus(false);
        setContractVerified(false);
        // setIsVerifying(false);
      }

      try {
        let erc1155: any = {};
        const provider = await new JsonRpcProvider(providerRpcUrl);
        const abi1155 = new Interface(erc1155abi);
        // This can be an address or an ENS name
        const address = `${currentContractAddress}`.toLowerCase();

        if (address && abi1155 && provider) {
          erc1155 = await new Contract(address, abi1155, provider);
          // Get the token name
          const tokenName = await erc1155.name();
          const tokenExists = await erc1155.balanceOf(
            '0x6e603b75E422Db8cb5f98a62FA56D1638786bE83',
            1
          );
          console.log('Token 1155 Name ===> ', tokenName);
          console.log('Token 1155 info ===> ', tokenExists);
          if (tokenName && tokenExists) {
            setContractName(tokenName);
            setContractStatus(true);
            setContractVerified(false);
            setIsVerifying(false);
            return;
          }
        }
      } catch (error) {
        console.log('Error ===> ', error);
        setContractStatus(false);
        setContractVerified(false);
        setIsVerifying(false);
      }
    }
  };

  /* const prepareTweet = async (tweetContent: string) => {
    const re0 = /#TITLE#/gi;
    const new0TweetContent = tweetContent.replace(
      re0,
      datalock?.api_locks_by_pk?.name
    );
    const re1 = /#LINKLOCK#/gi;
    const new1TweetContent = new0TweetContent.replace(
      re1,
      `https://mintships.xyz/${Base64.btoa(
        `/${datalock?.api_locks_by_pk?.id}-unlockcontent`
      )}`
    );
    const re2 = /#WALLETADDRESS#/gi;
    const new2TweetContent = new1TweetContent.replace(
      re2,
      datalock?.api_locks_by_pk?.walletAddress
    );
    const re3 = /#UUID#/gi;
    const new3TweetContent = new2TweetContent.replace(re3, 'UUIDv4');
    // [#TITLE#]
    // [#LINKLOCK#]
    // [#WALLETADDRESS#]
    // [#UUID#]
    return new3TweetContent;
  }; */

  /* const sendTweet = async (e: any, tweetUnlock: string) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const tweet = await prepareTweet(tweetUnlock);
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
        '_blank'
      );
    }
  }; */

  const uploadFile = async (e: any) => {
    setUploading(true);
    e.preventDefault();

    try {
      const added = await ipfs.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // setUrl(url);
      setIpfsCidUrl(url);
      setUploaded(true);
    } catch (err) {
      console.log('Error uploading the file : ', err);
    }
    setUploading(false);
  };

  const preUpload = (e: any) => {
    if (e.target.value !== '') {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
      const src = URL.createObjectURL(e.target.files[0]);
      setFileUrl(src);
    } else {
      setFile({});
    }
  };

  const resetUpload = (e: any) => {
    e.preventDefault();
    setFile(false);
    setUploaded(false);
    setFileUrl('');
  };

  watch('contractAddress'); // you can supply default value as second argument

  useEffect(() => {
    const lockTypeSelection = async () => {
      if (selectedLockingTypes?.id) {
        setSelectedLockingTypes(
          lockingTypes[parseInt(selectedLockingTypes?.id, 10) - 1]
        );
        const NETWORK_PROVIDER = getRandomElement(
          chainId !== 'undefined' && getProviderByChainId(String(chainId))
        );
        if (contractAddress && selectedLockingTypes.id === 1) {
          await verifyNftContract(NETWORK_PROVIDER, String(contractAddress));
        }

        if (contractAddress && selectedLockingTypes.id === 4) {
          await verifyTokenContract(NETWORK_PROVIDER, String(contractAddress));
        }
      } else {
        setSelectedLockingTypes(lockingTypes[0]);
      }
    };
    lockTypeSelection();
    // setSelectedLockingTypes(selectedLockingTypes?.id ? lockingTypes[selectedLockingTypes.id] : lockingTypes[0]);
    // if (selectedLockingTypes?.id) setValue('lockType', selectedLockingTypes.id);

    const getAccount = async () => {
      const accounts = await window.ethereum.enable();
      console.log('Account ==> ', accounts[0]);
      setChainId(window.ethereum.networkVersion);
    };
    getAccount();
  }, [ipfsThumbUrl, thumbnailUrl, selectedLockingTypes]);

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (name === 'contractAddress' && type === 'change') {
        // console.log(contractVerified, watchContractAdress, value, name, type);
        if (value && !contractVerified) {
          const NETWORK_PROVIDER = getRandomElement(
            chainId && getProviderByChainId(String(chainId))
          );

          setContractAddress(String(value.contractAddress));
          if (selectedLockingTypes.id === 1) {
            await verifyNftContract(
              NETWORK_PROVIDER,
              String(value?.contractAddress)
            );
          }

          if (selectedLockingTypes.id === 4) {
            await verifyTokenContract(
              NETWORK_PROVIDER,
              String(value?.contractAddress)
            );
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [chainId, contractAddress, contractVerified, watch]);

  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="Mintships Alpha"
          description="Enable the use of membership/ticket NFTs in physical spaces and allow sharing unlockable content possible and easy for all creators."
        />
      }
    >
      <div className="flex relative flex-col mb-6 w-full min-w-0 break-words bg-gray-100 rounded-lg border-0 shadow-lg">
        <div className="p-6 mb-0 bg-white rounded-t">
          <div className="flex justify-between text-center">
            <h6 className="text-xl font-bold text-gray-700">
              New Content Lock
            </h6>
          </div>
        </div>
        {loading ? (
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
          <div className="flex-auto py-10 px-4 pt-0 lg:px-5">
            <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
              Thumbnail
            </h6>
            <div className="flex flex-wrap">
              <div>
                <div className="flex items-center mt-1">
                  <span className="inline-block overflow-hidden w-16 h-16 bg-gray-100 rounded-full">
                    {thumbnailUrl ? (
                      <img
                        className="object-cover object-center w-16 h-16 text-gray-300"
                        src={thumbnailUrl}
                      />
                    ) : (
                      <svg
                        className="w-full h-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  {/* <button
                  type="button"
                  className="py-2 px-3 ml-3 text-sm font-medium leading-4 text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                >
                  Select Thumbnail Image
                  </button> */}
                  <ImageUpload
                    setMediaUrl={setThumbnailUrl}
                    setUrl={setIpfsThumbUrl}
                    onlyButton={true}
                    classNameSubmit="py-2 px-3 ml-3 text-sm font-medium leading-4 text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
                    buttonText="Select Thumbnail Image"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-gray-300 border-b-1" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                Lock Method
              </h6>
              <div className="flex flex-wrap">
                <div className="inline-block px-4">
                  <RadioGroup
                    value={selectedLockingTypes}
                    onChange={setSelectedLockingTypes}
                  >
                    <RadioGroup.Label className="text-base font-medium text-gray-900">
                      Select a method to unlock your content
                    </RadioGroup.Label>

                    <div className="grid grid-cols-1 gap-y-6 mt-4 sm:grid-cols-3 sm:gap-x-4">
                      {lockingTypes.map((lockingType) => (
                        <RadioGroup.Option
                          key={lockingType.id}
                          value={lockingType}
                          className={({ checked, active }): any =>
                            classNames(
                              checked
                                ? 'border-transparent'
                                : 'border-gray-300',
                              active ? 'ring-2 ring-green-500' : '',
                              'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                            )
                          }
                        >
                          {({ checked, active }) => (
                            <>
                              <div className="flex flex-1">
                                <div className="flex flex-col">
                                  <RadioGroup.Label
                                    as="span"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    {lockingType.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className="flex items-center mt-1 text-sm text-gray-500"
                                  >
                                    {lockingType.description}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              <CheckCircleIcon
                                className={classNames(
                                  !checked ? 'invisible' : '',
                                  'h-5 w-5 text-green-600'
                                )}
                                aria-hidden="true"
                              />
                              <div
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked
                                    ? 'border-green-500'
                                    : 'border-transparent',
                                  'absolute -inset-px rounded-lg pointer-events-none'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {selectedLockingTypes?.id === 3 && (
                <>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                    Tweet Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="px-4 w-full lg:w-12/12">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <div className="relative mb-3 w-full">
                            <label
                              className="block mb-2 text-xs font-bold text-gray-900 uppercase"
                              htmlFor="tweetUnlock"
                            >
                              Tweet
                            </label>
                            <textarea
                              {...register('tweetUnlock')}
                              className="p-3 w-full text-sm placeholder:text-gray-300 text-gray-600 bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear"
                              rows={6}
                              placeholder="Requesting to unlock access to content #XYZ using 0x0000000000000000000000000000000000000000 on the #Goerli #Ethereum test network via https://mintships.xyz/zXy64Esxc"
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label
                            className="block mb-2 text-xs font-bold text-gray-900 uppercase"
                            htmlFor="tweetAddress"
                          >
                            You can compose your tweet with the following
                            variables:
                          </label>
                          <div>
                            <p className="text-sm font-bold text-gray-400">
                              <a
                                id="title"
                                className="relative font-bold text-gray-400 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                              >
                                #TITLE#
                              </a>
                            </p>
                            <p className="text-sm font-bold text-gray-400">
                              <a
                                id="linklock"
                                className="relative font-bold text-gray-400 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                              >
                                #LINKLOCK#
                              </a>
                            </p>
                            <p className="text-sm font-bold text-gray-400">
                              <a
                                id="walletaddress"
                                className="relative font-bold text-gray-400 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                              >
                                #WALLETADDRESS#
                              </a>
                            </p>
                            <p className="mb-3 text-sm font-bold text-gray-400">
                              <a
                                id="uuid"
                                className="relative font-bold text-gray-400 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                              >
                                #UUID#
                              </a>
                            </p>
                          </div>
                          {/* <button
                            type="button"
                            onClick={(e) =>
                              sendTweet(
                                e,
                                datalock?.api_locks_by_pk?.tweetUnlock
                              )
                            }
                            className="py-2 px-10 w-full font-bold text-white uppercase bg-blue-700 active:bg-blue-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear text-md"
                          >
                            Check Tweet
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedLockingTypes?.id === 2 && (
                <>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                    Payment Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="px-4 w-full lg:w-12/12">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <div className="relative mb-3 w-full">
                            <label
                              className="block mb-2 text-xs font-bold text-gray-900 uppercase"
                              htmlFor="grid-password"
                            >
                              Wallet address
                            </label>
                            <input
                              type="text"
                              {...register('walletAddress', {
                                required: true,
                                maxLength: 42,
                              })}
                              className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                              placeholder="Your wallet address"
                            />
                            {errors.name && errors.name.type === 'required' && (
                              <span>This is required</span>
                            )}
                            {errors.name &&
                              errors.name.type === 'maxLength' && (
                                <span>Max length exceeded</span>
                              )}
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label
                            htmlFor="paymentUnlockAmount"
                            className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                          >
                            Amount to Pay
                          </label>
                          <div className="flex mt-1 rounded-md">
                            <input
                              type="number"
                              {...register('paymentUnlockAmount', {
                                required: true,
                                min: 0.001,
                              })}
                              id="paymentUnlockAmount"
                              className="p-3 w-full text-sm font-bold bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                              placeholder="0.000"
                              step="0.001"
                            />
                            <span className="inline-flex items-center p-2 px-3 font-bold text-gray-500 bg-gray-50 rounded-r-md border-0 border-l-0 border-gray-300 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear text-md">
                              {getCurrencyByChainId(String(chainId))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                Locked Content Information
              </h6>
              <div className="flex flex-wrap">
                <div className="px-4 w-full lg:w-12/12">
                  <div className="relative mb-3 w-full">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: true, maxLength: 130 })}
                      className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                      placeholder="Your locked content name"
                    />
                    {errors.name && errors.name.type === 'required' && (
                      <span>This is required</span>
                    )}
                    {errors.name && errors.name.type === 'maxLength' && (
                      <span>Max length exceeded</span>
                    )}
                  </div>
                </div>

                <div className="px-4 w-full lg:w-12/12">
                  <div className="relative mb-3 w-full">
                    <label
                      className="block mb-2 text-xs font-bold text-gray-600 uppercase"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: true })}
                      className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                      rows={3}
                      placeholder="Get exclusive access to a beautiful art work!"
                    ></textarea>
                    {errors.name && errors.name.type === 'required' && (
                      <span>This is required</span>
                    )}
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                Contract Information
              </h6>
              <div className="flex flex-wrap">
                <div className="px-4 w-full lg:w-12/12">
                  <div className="relative mb-1 w-full">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="contractAddress"
                    >
                      Contract Address
                    </label>
                    <input
                      {...register('contractAddress')}
                      type="text"
                      className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                      placeholder="0x0000000000000000000000000000000000000000"
                    />
                    {errors.name && errors.name.type === 'required' && (
                      <span>This is required</span>
                    )}

                    {isVerifying && (
                      <span className="flex flex-wrap mt-2 text-xs font-bold">
                        <svg
                          className="mr-3 w-6 h-6 text-orange-600 animate-spin"
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
                        <span className="mt-1 text-red-600">Verifying...</span>
                      </span>
                    )}

                    {!contractStatus && !isVerifying && (
                      <span className="flex flex-wrap mt-2 text-xs font-bold text-red-600 align-middle">
                        <BanIcon className="w-5 h-5" aria-hidden="true" />{' '}
                        <span className="mt-1">
                          {selectedLockingTypes?.id === 1
                            ? 'Not valid ERC721 or ERC1155 NFT Contract!'
                            : 'Not valid ERC20 Contract!'}
                        </span>
                      </span>
                    )}
                    {contractStatus && !isVerifying && (
                      <span className="flex flex-wrap mt-2 text-xs font-bold text-green-600 align-middle">
                        <BadgeCheckIcon
                          className="w-6 h-6"
                          aria-hidden="true"
                        />{' '}
                        <span className="mt-1">
                          Valid [
                          <span className="text-green-900">
                            {contractName ||
                              (selectedLockingTypes?.id === 1
                                ? 'ERC721 or ERC1155'
                                : 'ERC20')}
                          </span>
                          ] {selectedLockingTypes?.id === 1 ? 'NFT' : 'Token'}{' '}
                          Contract!
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
                Network Name
              </h6>
              <div className="flex flex-wrap">
                <div className="inline-block px-4 w-full">
                  {!loading && (
                    <NetworkDropdown
                      chainId={chainId && String(chainId)}
                      setChainId={setChainId}
                      verifyContract={async (NETWORK_PROVIDER: string) => {
                        if (contractAddress && selectedLockingTypes.id === 1) {
                          verifyNftContract(
                            NETWORK_PROVIDER,
                            String(contractAddress)
                          );
                        }
                        if (contractAddress && selectedLockingTypes.id === 4) {
                          verifyTokenContract(
                            NETWORK_PROVIDER,
                            String(contractAddress)
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="mt-3 mb-1 text-sm font-bold text-gray-900 uppercase">
                Upload a file or paste a link
              </h6>

              <div className="inline-flex mb-6 rounded-md shadow-sm">
                <a
                  id="uploadfile"
                  href="true"
                  onClick={(e) => setLockContentSource(e, 0)}
                  aria-current="page"
                  className="focus:z-10 py-2 px-4 text-sm font-medium text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-l-md border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                >
                  Upload a file to lock
                </a>
                <a
                  id="uselink"
                  href="true"
                  onClick={(e) => setLockContentSource(e, 1)}
                  className="focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-r-md border-y border-r border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                >
                  Lock a existing link
                </a>
              </div>

              <div className="flex flex-wrap mb-6">
                <div className="px-4 w-full lg:w-12/12">
                  <div>
                    {/* eslint-disable no-nested-ternary */}
                    {!fileOrLink ? (
                      !file ? (
                        <div className="flex justify-center py-5 px-6 mt-1 rounded-md border-2 border-gray-300 border-dashed">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto w-12 h-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-lg text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative font-bold text-indigo-600 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                              >
                                <span>Select a file</span>
                                <input
                                  type="file"
                                  ref={inputFile}
                                  onChange={(e) => preUpload(e)}
                                  className="hidden invisible"
                                />
                                <button
                                  id="file-upload"
                                  name="file-upload"
                                  type="button"
                                  className="sr-only"
                                  onClick={() => inputFile.current.click()}
                                />
                              </label>

                              <p className="pl-1"> to upload to IPFS</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              You can upload any file type you want.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2 py-3 mt-1 text-sm">
                            Link:
                            <span className="py-0.5 px-2.5 mr-2 text-xs font-semibold text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200 rounded">
                              {ipfsCidUrl || 'no ipfs cid yet'}
                            </span>
                            {[
                              'video/mp4',
                              'video/ogg',
                              'video/x-msvideo',
                              'video/quicktime',
                            ].includes(file.type) && (
                              <div className="block overflow-hidden rounded-lg aspect-w-10 aspect-h-7 w-75">
                                <video
                                  controls
                                  className="object-cover object-center w-full"
                                  loop
                                >
                                  <source
                                    type={file.type}
                                    src={
                                      fileUrl ||
                                      '/assets/images/placeholder.png'
                                    }
                                  />
                                  Sorry, your browser doesnt support embedded
                                  videos.
                                </video>
                              </div>
                            )}
                            {['audio/mpeg', 'audio/ogg', 'audio/wav'].includes(
                              file.type
                            ) && (
                              <div className="block overflow-hidden rounded-lg">
                                <audio
                                  controls
                                  className="object-cover object-center w-full"
                                  loop
                                >
                                  <source
                                    type={file.type}
                                    src={
                                      fileUrl ||
                                      '/assets/images/placeholder.png'
                                    }
                                  />
                                  Sorry, your browser doesnt support embedded
                                  audios.
                                </audio>
                              </div>
                            )}
                            {['image/png', 'image/jpeg', 'image/gif'].includes(
                              file.type
                            ) && (
                              <div className="block overflow-hidden rounded-lg aspect-w-10 aspect-h-7 w-75">
                                <img
                                  className="object-cover object-center w-full"
                                  src={
                                    fileUrl || '/assets/images/placeholder.png'
                                  }
                                  alt={file.name}
                                />
                              </div>
                            )}
                          </div>

                          <div className="col-span-3 py-3 w-full lg:col-span-1">
                            {!uploaded && (
                              <>
                                <p className="pb-3 text-sm text-blue-500">
                                  Your file is ready to upload to IPFS, please
                                  click button bellow to complete the process.
                                </p>
                                <button
                                  className="py-2 px-6 mr-3 font-bold text-white uppercase bg-gray-500 hover:bg-blue-600 active:bg-blue-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear cursor-pointer touch-auto text-md"
                                  type="button"
                                  onClick={(e) => uploadFile(e)}
                                >
                                  {uploading ? 'Uploading...' : 'Upload File'}
                                </button>
                              </>
                            )}

                            {uploaded && (
                              <p className="pb-3 text-green-500 text-md">
                                File uploaded to IPFS successfully.
                              </p>
                            )}

                            {!uploading && (
                              <button
                                className="py-2 px-10 font-bold text-white uppercase bg-gray-300 hover:bg-red-600 active:bg-red-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear cursor-pointer touch-auto text-md"
                                type="button"
                                onClick={(e) => resetUpload(e)}
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="relative mb-3 w-full">
                        <label
                          className="block mb-2 text-xs font-bold text-gray-900 uppercase"
                          htmlFor="contractAddress"
                        >
                          Link to lock
                        </label>
                        <input
                          {...register('cid')}
                          type="text"
                          className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                          placeholder="Link to lock"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button
                  className="py-2 px-10 mr-3 text-lg font-bold text-white uppercase bg-red-700 active:bg-red-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear"
                  type="reset"
                  onClick={() => router.push('/')}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-10 text-lg font-bold text-white uppercase bg-green-700 active:bg-green-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear"
                  type="submit"
                >
                  Save Lock
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Index;
