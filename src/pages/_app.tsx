import { ApolloProvider } from '@apollo/client';
import { DAppProvider } from '@usedappify/core';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
// import Router from 'next/router';
// import NProgress from 'nprogress';
import { SkeletonTheme } from 'react-loading-skeleton';

import { useApollo } from '@/services/apolloClient';
import { GRAPH_TESTNET_HTTPS_URI } from '@/utils/mintship';
import 'react-loading-skeleton/dist/skeleton.css';

import '@/styles/global.css';

/* NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
  NProgress.start();
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
}); */

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const apolloClient = useApollo({
    ...pageProps,
    network: {
      graphUri: GRAPH_TESTNET_HTTPS_URI,
    },
  });

  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={session}
    >
      <DAppProvider config={{}}>
        <ApolloProvider client={apolloClient}>
          <SkeletonTheme
            baseColor="#f1f1f1"
            highlightColor="#e4e6eb"
            borderRadius="0.5rem"
            duration={1}
          >
            <Component {...pageProps} />
          </SkeletonTheme>
        </ApolloProvider>
      </DAppProvider>
    </SessionProvider>
  );
};

export default MyApp;
