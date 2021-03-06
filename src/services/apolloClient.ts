import { useMemo } from 'react';

import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
  split,
} from '@apollo/client';
import { /* ApolloCache, */ InMemoryCache } from '@apollo/client/cache';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import fetch from 'cross-fetch';
import * as ethers from 'ethers';
import { createClient } from 'graphql-ws';

import {
  GRAPH_TESTNET_HTTPS_URI,
  GRAPH_TESTNET_WSS_URI,
} from '@/utils/mintship';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: any;

function createApolloClient(graphUri?: string, initialState?: any) {
  let userId: string | null = null;
  if (typeof window !== 'undefined') userId = localStorage.getItem('account');
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_SECRET,
        // 'X-Hasura-Role': 'admin',
        'X-Hasura-User-Id': userId
          ? ethers.utils.getAddress(userId)
          : '0x0000000000000000000000000000000000000000',
        'X-Hasura-Role': 'user',
        // 'x-hasura-role': 'anonymous',
      },
    });
    return forward(operation);
  });

  const httpLink = createHttpLink({
    uri: graphUri ?? GRAPH_TESTNET_HTTPS_URI,
    fetch,
  });

  const wsLink = process.browser
    ? new GraphQLWsLink(
        createClient({
          url: GRAPH_TESTNET_WSS_URI,
          lazy: true,
          keepAlive: 10_000, // ping server every 10 seconds
        })
      )
    : () => {
        console.log('SSR');
      };

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription' &&
        process.browser
      );
    },
    wsLink as ApolloLink,
    httpLink
  );

  return new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache().restore(initialState),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
    ssrMode: !process.browser,
    connectToDevTools: true,
  });
}

export function initializeApollo(initialState = null, graphUri?: string) {
  const currentApolloClient =
    apolloClient ?? createApolloClient(graphUri, initialState);

  /* if (initialState) {
    const existingCache = currentApolloClient.extract();

    // @ts-ignore
    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray: any, sourceArray: any) => [
        ...sourceArray,
        ...destinationArray.filter((d: any) =>
          sourceArray.every((s: any) => !isEqual(d, s))
        ),
      ],
    });
    currentApolloClient.cache.restore(data);
  } */

  if (typeof window === 'undefined') return currentApolloClient;
  if (!apolloClient) apolloClient = currentApolloClient;

  return currentApolloClient;
}

export const graphqlClient = initializeApollo(
  null,
  String(GRAPH_TESTNET_HTTPS_URI)
);

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, pageProps?.network?.graphUri),
    [state]
  );
  return store;
};
