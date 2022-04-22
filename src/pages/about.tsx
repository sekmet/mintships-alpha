import { useEffect, useState, Fragment } from 'react';

import { useEthers, useBlockMeta, useBlockNumber } from '@usedappify/core';
import { useRouter } from 'next/router';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';

declare let window: any;

const Index = () => {
  const router = useRouter();
  const [blockNumber, setBlockNumber] = useState<number | undefined>(0);
  const { account } = useEthers();
  const { timestamp } = useBlockMeta();
  const blocknumber = useBlockNumber();

  useEffect(() => {
    setBlockNumber(blocknumber);
    window.ethereum.on('accountsChanged', function () {
      router.reload();
    });
    window.ethereum.on('networkChanged', function () {
      router.reload();
    });
  }, [blocknumber]);

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
      <div className="inline shrink-0">
        <img
          className="w-16 h-16"
          src="/assets/images/logo_mintships_alpha.png"
          alt="Mintships Alpha"
        />
      </div>
      <div className="max-w-none prose prose-slate dark:prose-invert">
        <h1 className="text-2xl font-bold">Mintships Alpha</h1>

        <p className="leading-text">
          <span role="img" aria-label="rocket">
            🚀
          </span>{' '}
          Enable the use of membership/ticket NFTs in physical spaces and allow
          sharing unlockable content possible and easy for all creators.
          <span role="img" aria-label="zap">
            ⚡️
          </span>{' '}
        </p>
        <p className="leading-text">
          Mintships makes sharing unlockable content possible and easy for all
          creators and recognizes tokens held in the ETH/Polygon
          <br />
          <strong className="text-sm">
            (more networks available soon)
          </strong>{' '}
          wallet upon scanning of a QR code to enable the use of
          membership/ticket NFTs in physical spaces.
        </p>

        <p className="leading-text">
          There are many NFT token gating solutions available today, but none of
          them handle content distribution well. As a creator who wants to give
          exclusive access to media based, NFT token gating falls short. What
          creators need is a way to store private, verifiable content AND being
          able to serve that content based on ownership of an NFT.
        </p>

        <blockquote>Mintships tries solves that.</blockquote>

        <p className="leading-text">
          A simpler way to lock exclusive media content behind ownership of an
          NFT.
        </p>

        <blockquote>
          Upload a file, add some data about the file, choose what NFT contract
          (contract address and EVM chain) to check on, and thats it.
        </blockquote>

        <p className="leading-text">
          Creator will get a unique link that they can share knowing that the
          exlusive content is safely protected from unauthorized access. NFT
          projects, individual artists, brands, and more can leverage
          Mintships.xyz to easily lock and serve content.
        </p>

        {account && blockNumber && (
          <Fragment>
            <h2 className="-mt-3 mb-1 text-xl font-bold">Block number</h2>
            <h3 className="font-bold">
              <span className="inline-flex relative items-center py-0.5 px-2.5 text-lg font-medium text-green-400 bg-green-100 rounded-md">
                <svg
                  className="mt-1 -ml-0.5 w-6 h-6 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 10 10"
                >
                  <circle cx={4} cy={4} r={2} />
                </svg>
                <span className="inline-flex absolute top-2 left-2.5 w-4 h-4 bg-green-300 rounded-full opacity-75 animate-ping"></span>
                {`📦 ${blockNumber}`}
              </span>
              <br />
              <i className="text-xs">[ {`${timestamp}`} ]</i>
            </h3>
          </Fragment>
        )}
      </div>
    </Dashboard>
  );
};

export default Index;
