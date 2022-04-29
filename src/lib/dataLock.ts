import {
  gql,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import fetch from 'cross-fetch';

import { GRAPH_TESTNET_HTTPS_URI } from '@/utils/mintship';

const defaultOptions: any = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPH_TESTNET_HTTPS_URI,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_SECRET,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions,
});

const CURRENT_LOCK = gql`
  query GetLock($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      id
      name
      description
      thumbnailUrl
      contractAddress
      walletAddress
      paymentUnlockAmount
      tokenId
      contentMimeType
      tweetUnlock
      lockType
      chainId
      network
      userId
      timeoutHours
      createdAt
      status
    }
  }
`;

const REWARD_UNLOCK = gql`
  query GetReward($lockId: Int!) {
    api_locks(where: { id: { _eq: $lockId } }) {
      cid
      status
    }
  }
`;

export async function dataReward(lockid: number) {
  const { data } = await client.query({
    query: REWARD_UNLOCK,
    variables: { lockId: lockid },
  });
  return data;
}

export function dataLock(lockid: number) {
  const result = client
    .query({
      query: CURRENT_LOCK,
      variables: {
        lockId: lockid,
      },
    })
    .then((lock) => {
      // console.log('data ---', lock);
      return lock;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  return result;
}
