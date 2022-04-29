import { useEffect, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { QrcodeIcon, ShareIcon, LockClosedIcon } from '@heroicons/react/solid';
import { useEthers } from '@usedappify/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Base64 } from 'js-base64';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import { ConfirmAlert } from '@/components/Alerts';
import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import EXPLORE_LOCKS from '@/services/graphql/locks.query';
import REMOVELOCK from '@/services/graphql/removelock.mutation';

declare let window: any;

dayjs.extend(relativeTime);

export function getLockTypeName(lockId: number) {
  switch (String(lockId)) {
    case '1':
      return 'NFT';
    case '2':
      return 'Payment';
    case '3':
      return 'Retweet';
    default:
      return 'Unknown';
  }
}

const Index = () => {
  const router = useRouter();
  const [locks, setLocks] = useState<any>();
  const { account } = useEthers();
  const [getLocksData, { data, loading }] = useLazyQuery(EXPLORE_LOCKS);

  const [removeUserLock] = useMutation(REMOVELOCK, {
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

  const removeConfirmAlert = (item: any) => {
    ConfirmAlert(
      'warning',
      `Remove lock "${item.name ? item.name : `#${item.id}`}" ?`,
      'Are you sure you want to remove this lock?',
      'Confirm?',
      'Lock removed!',
      'Lock removed successfully...',
      'success',
      () => removeUserLock({ variables: { lockId: item.id } }),
      router
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLocksData({
        variables: {
          userId: account || '',
          offset: 0,
          limit: 30,
        },
      });
    };
    fetchData();

    if (data && !loading) {
      setLocks(data?.api_locks);
    }

    window.ethereum.on('accountsChanged', function () {
      router.reload();
    });
    window.ethereum.on('networkChanged', function () {
      router.reload();
    });
  }, [data, loading]);

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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Mintships</h1>
            <p className="mt-2 text-sm text-gray-700">
              Mintships for {account}
            </p>
          </div>
          <div className="mt-4 sm:flex-none sm:mt-0 sm:ml-16">
            <Link href="/new-lock">
              <a
                id="newlock"
                className="inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm sm:w-auto"
              >
                New Content Lock
              </a>
            </Link>
          </div>
        </div>
        <div className="overflow-hidden -mx-4 mt-8 ring-1 ring-black ring-opacity-5 shadow sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-sm font-semibold text-left text-gray-900 sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden py-3.5 px-3 text-sm font-semibold text-left text-gray-900 lg:table-cell"
                >
                  Network
                </th>
                <th
                  scope="col"
                  className="hidden py-3.5 px-3 text-sm font-semibold text-left text-gray-900 sm:table-cell"
                >
                  Lock Type
                </th>
                <th
                  scope="col"
                  className="hidden py-3.5 px-3 text-sm font-semibold text-left text-gray-900 sm:table-cell"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-3 text-sm font-semibold text-left text-gray-900"
                >
                  QRcode
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-3 text-sm font-semibold text-left text-gray-900"
                >
                  Share
                </th>
                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? [...Array(6)].map((_, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mt-1 col-sm-2">
                            <div className="p-3 text-center card">
                              <Skeleton
                                enableAnimation={true}
                                className="rounded-sm"
                                count={1}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}

              {locks?.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-3">
                    <div className="flex justify-center py-5 px-6 mt-1 rounded-md border-2 border-gray-300 border-dashed">
                      <div className="space-y-1 text-center">
                        <LockClosedIcon
                          className="mx-auto w-12 h-12 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="flex text-lg text-gray-600">
                          <label
                            htmlFor="new-lock"
                            className="relative font-bold text-indigo-600 hover:text-indigo-500 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                          >
                            <span>Click here</span>
                            <Link href="/new-lock" passHref>
                              <button
                                id="new-lock"
                                name="new-lock"
                                type="button"
                                className="sr-only"
                              />
                            </Link>
                          </label>
                          <p className="pl-1"> to create a new LOCK</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          You have no locks active.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {locks?.map((lock: any) => (
                <tr key={lock.id}>
                  <td className="py-4 pr-3 pl-4 w-full max-w-0 text-sm font-medium text-gray-900 sm:pl-6 sm:w-auto sm:max-w-none">
                    <Link href={`/lock-details/${lock.id}`}>
                      <a id="lock-details">{lock.name}</a>
                    </Link>
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Network</dt>
                      <dd className="mt-1 text-gray-700 truncate">
                        {lock.network}
                      </dd>
                      <dt className="sr-only sm:hidden">Lock Type</dt>
                      <dd className="mt-1 text-gray-500 truncate sm:hidden">
                        {getLockTypeName(lock.lockType)}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden py-4 px-3 text-sm text-gray-500 lg:table-cell">
                    {lock.network}
                  </td>
                  <td className="hidden py-4 px-3 text-xs font-semibold text-gray-700 sm:table-cell">
                    {getLockTypeName(lock.lockType)}
                  </td>
                  <td className="hidden py-4 px-3 text-sm text-gray-500 sm:table-cell">
                    {dayjs(lock.createdAt).fromNow()}
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    <Link href={Base64.btoa(`/${lock.id}-qrcode`)}>
                      <a href="#" className="text-gray-600 hover:text-blue-900">
                        <QrcodeIcon className="w-6 h-6" aria-hidden="true" />
                        <span className="sr-only">, QRCode {lock.name}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    {lock.cid && (
                      <Link href={Base64.btoa(`/${lock.id}-unlockcontent`)}>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-indigo-900"
                        >
                          <ShareIcon className="w-6 h-6" aria-hidden="true" />
                          <span className="sr-only">, Share {lock.name}</span>
                        </a>
                      </Link>
                    )}
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    <a
                      href="#"
                      onClick={() => removeConfirmAlert(lock)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete<span className="sr-only">, {lock.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
