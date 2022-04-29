import { useEffect, useState } from 'react';

// import { gql } from '@apollo/client';
import { useEthers } from '@usedappify/core';
import { Base64 } from 'js-base64';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { dataLock } from '@/lib/dataLock';

import ContentLockPage from './content';
import PaymentLockPage from './payment';
import QrcodeLockPage from './qrcode';
import RetweetLockPage from './tweet';

declare let window: any;

/* const CURRENT_LOCK = gql`
  query GetLock($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      id
      name
      description
      thumbnailUrl
      contractAddress
      tokenId
      contentMimeType
      lockType
      chainId
      network
      userId
      timeoutHours
      createdAt
      status
    }
  }
`; */

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
  // const [getLockData, { data, loading }] = useLazyQuery(CURRENT_LOCK);
  const [datalock, setDatalock] = useState<any>();
  const { lockid, lockmode } = props;
  let data: any;
  let loading: boolean = false;

  useEffect(() => {
    const fetchData = async () => {
      /* console.log(dataLock(lockid));
      await getLockData({
        variables: {
          lockId: lockid || '',
        },
      }); */
      // setLoading(loading);
      const result = await dataLock(lockid);
      data = result.data;
      loading = result.loading;

      if (data && data.api_locks.length > 0) {
        setDatalock(data);
      }
    };
    fetchData();

    window.ethereum.on('accountsChanged', function () {
      // console.log('accountsChanged');
      router.reload();
    });
    window.ethereum.on('networkChanged', function () {
      router.reload();
    });
  }, []);

  if (lockmode === 'qrcode') {
    return (
      <QrcodeLockPage
        {...props}
        account={account}
        data={datalock}
        loading={loading}
      />
    );
  }

  if (datalock?.api_locks[0]?.lockType === 2) {
    return (
      <PaymentLockPage
        {...props}
        account={account}
        data={datalock}
        loading={loading}
      />
    );
  }

  if (datalock?.api_locks[0]?.lockType === 3) {
    return (
      <RetweetLockPage
        {...props}
        account={account}
        data={datalock}
        loading={loading}
      />
    );
  }

  return (
    <ContentLockPage
      {...props}
      account={account}
      data={datalock}
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
