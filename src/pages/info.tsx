import { useEffect, useState, Fragment } from 'react';

import { useEthers, useBlockMeta, useBlockNumber } from '@usedappify/core';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';

const Index = () => {
  // const router = useRouter();
  const [blockNumber, setBlockNumber] = useState<number | undefined>(0);
  const { account } = useEthers();
  const { timestamp } = useBlockMeta();
  const blocknumber = useBlockNumber();

  useEffect(() => {
    setBlockNumber(blocknumber);
  }, [blocknumber]);

  return (
    <Dashboard
      auth={true}
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <div className="max-w-none prose prose-slate dark:prose-invert">
        <h1 className="text-2xl font-bold">
          Boilerplate code for your NextJS 12.x + Typescript + Ethers v5.x +
          Tailwind CSS v3.x for <i>Web3</i> using <i>Ethereum</i> network.
        </h1>
        <p className="leading-text">
          <span role="img" aria-label="rocket">
            🚀
          </span>{' '}
          Next.js Boilerplate is a starter code for your Next js project for
          Web3 by putting developer experience first .<br />
          <span role="img" aria-label="zap">
            ⚡️
          </span>{' '}
          Made with Next.js, TypeScript, ESLint, Prettier, Husky, Lint-Staged,
          VSCode, Netlify, PostCSS, Tailwind CSS,and Ethers.
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

        <h2 className="text-lg font-semibold">Next js Boilerplate Features</h2>
        <p>Developer experience first:</p>
        <ul>
          <li>
            <span role="img" aria-label="fire">
              🔥
            </span>{' '}
            <a href="https://nextjs.org" rel="nofollow">
              Next.js
            </a>{' '}
            for Static Site Generator
          </li>
          <li>
            <span role="img" aria-label="art">
              🎨
            </span>{' '}
            Integrate with{' '}
            <a href="https://tailwindcss.com" rel="nofollow">
              Tailwind CSS
            </a>
          </li>
          <li>
            <span role="img" aria-label="nail_care">
              💅
            </span>{' '}
            PostCSS for processing Tailwind CSS
          </li>
          <li>
            <span role="img" aria-label="nail_care">
              🧮
            </span>{' '}
            <a href="https://docs.ethers.io/v5/" rel="nofollow">
              Ethers
            </a>{' '}
            for interacting with the Ethereum Blockchain and its ecosystem.
          </li>
          <li>
            <span role="img" aria-label="tada">
              🎉
            </span>{' '}
            Type checking Typescript
          </li>
          <li>
            <span role="img" aria-label="pencil2">
              ✏️
            </span>{' '}
            Linter with{' '}
            <a href="https://eslint.org" rel="nofollow">
              ESLint
            </a>
          </li>
          <li>
            <span role="img" aria-label="hammer_and_wrench">
              🛠
            </span>{' '}
            Code Formatter with{' '}
            <a href="https://prettier.io" rel="nofollow">
              Prettier
            </a>
          </li>
          <li>
            <span role="img" aria-label="fox_face">
              🦊
            </span>{' '}
            Husky for Git Hooks
          </li>
          <li>
            <span role="img" aria-label="no_entry_sign">
              🚫
            </span>{' '}
            Lint-staged for running linters on Git staged files
          </li>
          <li>
            <span role="img" aria-label="no_entry_sign">
              🗂
            </span>{' '}
            VSCode configuration: Debug, Settings, Tasks and extension for
            PostCSS, ESLint, Prettier, TypeScript
          </li>
          <li>
            <span role="img" aria-label="robot">
              🤖
            </span>{' '}
            SEO metadata, JSON-LD and Open Graph tags with Next SEO
          </li>
          <li>
            <span role="img" aria-label="robot">
              ⚙️
            </span>{' '}
            <a
              href="https://www.npmjs.com/package/@next/bundle-analyzer"
              rel="nofollow"
            >
              Bundler Analyzer
            </a>
          </li>
          <li>
            <span role="img" aria-label="rainbow">
              🌈
            </span>{' '}
            Include a FREE minimalist theme
          </li>
          <li>
            <span role="img" aria-label="hundred">
              💯
            </span>{' '}
            Maximize lighthouse score
          </li>
        </ul>
        <p>Built-in feature from Next.js:</p>
        <ul>
          <li>
            <span role="img" aria-label="coffee">
              ☕
            </span>{' '}
            Minify HTML &amp; CSS
          </li>
          <li>
            <span role="img" aria-label="dash">
              💨
            </span>{' '}
            Live reload
          </li>
          <li>
            <span role="img" aria-label="white_check_mark">
              ✅
            </span>{' '}
            Cache busting
          </li>
        </ul>
        <h2 className="text-lg font-semibold">Our Stater code Philosophy</h2>
        <ul>
          <li>Minimal code</li>
          <li>SEO-friendly</li>
          <li>
            <span role="img" aria-label="rocket">
              🚀
            </span>{' '}
            Production-ready
          </li>
        </ul>
      </div>
    </Dashboard>
  );
};

export default Index;
