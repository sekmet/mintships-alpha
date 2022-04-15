import { useEffect, useState } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { useEthers } from '@usedappify/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Base64 } from 'js-base64';
import Link from 'next/link';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';
import { ellipsisAddressUrl } from '@/utils';

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

const EXPLORE_LOCKS = gql`
  query Locks($userId: String!, $offset: Int, $limit: Int) {
    api_locks_aggregate {
      aggregate {
        count
      }
    }
    api_locks(
      where: { userId: { _eq: $userId } }
      limit: $limit
      offset: $offset
      order_by: { id: desc }
    ) {
      id
      name
      cid
      userId
      createdAt
      lockType
      status
    }
  }
`;

const Index = () => {
  // const router = useRouter();
  const [locks, setLocks] = useState<any>();
  const { account } = useEthers();
  const [getLocksData, { data, loading }] = useLazyQuery(EXPLORE_LOCKS);

  /* const exploreLocks = (exploreLocksRequest: {
    userId: string;
    offset: number;
    limit: number;
  }) => {
    return apolloClient.query({
      query: gql(EXPLORE_LOCKS),
      variables: {
        ...exploreLocksRequest
      },
    });
  };
  
  const myLockings = async () => {
    const result = await exploreLocks({
      userId: account,
      offset: 0,
      limit: 30,
    });
  
    return result.data?.api_locks;
  }; */

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
  }, [data, loading]);

  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description={`Mintships for ${account}`}
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
                  CID
                </th>
                <th
                  scope="col"
                  className="hidden py-3.5 px-3 text-sm font-semibold text-left text-gray-900 sm:table-cell"
                >
                  Lock Type
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-3 text-sm font-semibold text-left text-gray-900"
                >
                  Created At
                </th>
                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                  <span className="sr-only">Share</span>
                </th>
                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                  <span className="sr-only">QRcode</span>
                </th>
                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locks?.map((lock: any) => (
                <tr key={lock.id}>
                  <td className="py-4 pr-3 pl-4 w-full max-w-0 text-sm font-medium text-gray-900 sm:pl-6 sm:w-auto sm:max-w-none">
                    <Link href={`/lock-details/${lock.id}`}>
                      <a id="lock-details">{lock.name}</a>
                    </Link>
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">CID</dt>
                      <dd className="mt-1 text-gray-700 truncate">
                        {lock.cid}
                      </dd>
                      <dt className="sr-only sm:hidden">Lock Type</dt>
                      <dd className="mt-1 text-gray-500 truncate sm:hidden">
                        {getLockTypeName(lock.lockType)}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden py-4 px-3 text-sm text-gray-500 lg:table-cell">
                    {ellipsisAddressUrl(lock.cid)}
                  </td>
                  <td className="hidden py-4 px-3 text-xs font-semibold text-gray-700 sm:table-cell">
                    {getLockTypeName(lock.lockType)}
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-500">
                    {dayjs(lock.createdAt).fromNow()}
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    <Link href={Base64.btoa(`/${lock.id}-qrcode`)}>
                      <a href="#" className="text-blue-600 hover:text-blue-900">
                        QRCode<span className="sr-only">, {lock.name}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    {lock.cid && (
                      <Link href={Base64.btoa(`/${lock.id}-unlockcontent`)}>
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Share<span className="sr-only">, {lock.name}</span>
                        </a>
                      </Link>
                    )}
                  </td>
                  <td className="py-4 pr-4 pl-3 text-sm font-medium text-right sm:pr-6">
                    <a href="#" className="text-red-600 hover:text-red-900">
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
