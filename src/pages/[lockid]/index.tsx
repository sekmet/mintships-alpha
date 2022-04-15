import React, { useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { useEthers } from '@usedappify/core';
import { Base64 } from 'js-base64';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ContentLockPage from './content';
import QrcodeLockPage from './qrcode';

declare let window: any;

const CURRENT_LOCK = gql`
  query GetLock($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      id
      name
      description
      thumbnailUrl
      contractAddress
      tokenId
      cid
      contentMimeType
      lockType
      secretKey
      chainId
      network
      userId
      timeoutHours
      createdAt
      status
    }
  }
`;

/* const CURRENT_LOCK_BY_USER = gql`
  query GetLockByUser($userId: String!, $lockId: Int!) {
    api_locks(where: { userId: { _eq: $userId }, id: { _eq: $lockId } }) {
      id
      name
      description
      thumbnailUrl
      contractAddress
      tokenId
      cid
      contentMimeType
      lockType
      secretKey
      chainId
      network
      userId
      timeoutHours
      createdAt
      status
    }
  }
`; */

function Lock(props: any) {
  const router = useRouter();
  const { account } = useEthers();
  const [getLockData, { data, loading }] = useLazyQuery(CURRENT_LOCK);
  const { lockid, lockmode } = props;

  useEffect(() => {
    const fetchData = async () => {
      await getLockData({
        variables: {
          lockId: lockid || '',
        },
      });
    };
    fetchData();

    window.ethereum.on('accountsChanged', function () {
      // console.log('accountsChanged');
      router.reload();
    });
  }, [data, loading]);

  if (lockmode === 'qrcode') {
    return (
      <QrcodeLockPage
        {...props}
        account={account}
        data={data}
        loading={loading}
      />
    );
  }
  return (
    <ContentLockPage
      {...props}
      account={account}
      data={data}
      loading={loading}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { lockid } = context.query;
  const decLockid = String(`${Base64.atob(String(lockid))}`.split('/')[1]);
  const lockId = parseInt(String(`${decLockid}`.split('-')[0]), 10);
  const lockMode = String(`${decLockid}`.split('-')[1]);
  return {
    props: {
      lockid: lockId,
      lockmode: lockMode,
    },
  };
};

export default Lock;
