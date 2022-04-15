import { useEffect, useState } from 'react';

import { gql } from '@apollo/client/core';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ImageUpload } from '@sekmet/react-ipfs-uploader';
import { useEthers } from '@usedappify/core';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import NetworkDropdown from '@/components/Dropdowns/NetworkDropdown';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import { graphqlClient as apolloClient } from '@/services/apolloClient';
import { classNames } from '@/utils';

const lockingTypes = [
  {
    id: 1,
    title: 'NFT Ownership',
    description:
      'Require a ownership of a particular (ERC721) NFT to unlock the content',
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
];

const CREATE_LOCK = `
mutation NewLock($lock: api_locks_insert_input!) {
insert_api_locks(objects: [$lock]) {
    returning {
    id
    userId
    name
    thumbnailUrl
    cid
    status
    createdAt
    }
}
}`;

const createLockedContent = (lockRequest: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contractAddress: string;
  chainId: string;
  lockType: string;
  cid: string;
}) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_LOCK),
    variables: {
      lock: lockRequest,
    },
  });
};

const Index = () => {
  // const router = useRouter();
  const { account } = useEthers();
  const [selectedLockingTypes, setSelectedLockingTypes] = useState<any>(
    lockingTypes[0]
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const [ipfsThumbUrl, setIpfsThumbUrl] = useState<string>();
  const [chainId, setChainId] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const lockData: any = {};
    lockData.lockType = selectedLockingTypes.id;
    lockData.chainId = chainId || '80001';
    lockData.thumbnailUrl = ipfsThumbUrl || '';
    lockData.cid = '';
    lockData.userId = account;
    lockData.status = 1;
    const mergedItem = Object.assign(data, lockData);
    console.log({ ...mergedItem });

    const createLockedResult = await createLockedContent({
      ...mergedItem,
    });
    console.log(data);
  };
  console.log(errors);

  useEffect(() => {
    console.log(thumbnailUrl);
  }, [thumbnailUrl]);

  return (
    <Dashboard
      auth={true}
      meta={<Meta title="Mintships Alpha" description="Submarines/Mintships" />}
    >
      <div className="flex relative flex-col mb-6 w-full min-w-0 break-words bg-gray-100 rounded-lg border-0 shadow-lg">
        <div className="p-6 mb-0 bg-white rounded-t">
          <div className="flex justify-between text-center">
            <h6 className="text-xl font-bold text-gray-700">
              Unlock content with a ERC721 token
            </h6>
          </div>
        </div>
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
                            checked ? 'border-transparent' : 'border-gray-300',
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
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
              Contract Information
            </h6>
            <div className="flex flex-wrap">
              <div className="px-4 w-full lg:w-12/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                    htmlFor="contractAddress"
                  >
                    Contract Address
                  </label>
                  <input
                    {...register('contractAddress', { required: true })}
                    type="text"
                    className="p-3 w-full text-sm bg-white rounded border-0 focus:outline-none focus:ring shadow transition-all duration-150 ease-linear placeholder:text-blueGray-300 text-blueGray-600"
                    placeholder="0x0000000000000000000000000000000000000000"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
              Network Name
            </h6>
            <div className="flex flex-wrap">
              <div className="inline-block px-4 w-full">
                <NetworkDropdown chainId="80001" setChainId={setChainId} />
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="mt-3 mb-6 text-sm font-bold text-gray-900 uppercase">
              File to submarine
            </h6>
            <div className="flex flex-wrap mb-6">
              <div className="px-4 w-full lg:w-12/12">
                <div>
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
                          className="relative font-bold text-indigo-600 hover:text-indigo-500 bg-white rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                        >
                          <span>Select a file</span>
                          <Link href="/upload" passHref>
                            <button
                              id="file-upload"
                              name="file-upload"
                              type="button"
                              className="sr-only"
                            />
                          </Link>
                        </label>
                        <p className="pl-1"> to upload to IPFS</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        You can upload PNG, JPG, GIF, MP4, MP3, OGG files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                className="py-2 px-10 text-lg font-bold text-white uppercase bg-green-700 active:bg-green-600 rounded outline-none focus:outline-none shadow hover:shadow-md transition-all duration-150 ease-linear"
                type="submit"
              >
                Save Lock
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
