import { useEffect } from 'react';

import { useEthers } from '@usedappify/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { GetServerSideProps } from 'next';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Auth } from '@/layouts/Auth';
import { Meta } from '@/layouts/Meta';
import { AppConfig } from '@/utils/AppConfig';

// declare let window: any;

// declare supportated chains
export const injected = new InjectedConnector({
  supportedChainIds: [
    1, 3, 4, 5, 42, 56, 69, 250, 1337, 80001, 43114, 1666600000, 1666700000,
    1313161554, 1313161555,
  ],
});

export default function Login(props: any) {
  const { activateBrowserWallet, account, activate } = useEthers();
  const router = useRouter();
  const { providers } = props;

  function handleConnectWallet() {
    activateBrowserWallet();
    console.log(account, providers);
  }

  useEffect(() => {
    async function getAccount() {
      // const accounts = await window.ethereum.enable();
      // const currAccount = accounts[0];
      const { query }: any = router;
      // do something with new account here
      console.log('Account ==> ', account);
      // const chainId = window.ethereum.networkVersion;
      if (account) {
        await signIn('credentials', {
          redirect: true,
          callbackUrl: query.callbackUrl,
          id: account,
        });
      }
      // localStorage.setItem('chainid', chainId);
      // setChainid(chainId);
      // localStorage.setItem('account', currAccount);
    }

    // window.ethereum.on('accountsChanged', function () {
    //  getAccount();
    // });

    if (account && account !== 'undefined') activate(injected);
    // console.log(account,injected)
    getAccount();
  }, [account]);

  return (
    <Auth meta={<Meta title="BOBA Nftify Login" description="BOBA Nftify" />}>
      <div className="flex flex-col justify-center py-12 min-h-full sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-3 text-4xl font-extrabold text-center text-gray-900 opacity-50">
            {AppConfig.title}
          </h1>
          <h2 className="mt-3 text-2xl font-extrabold text-center text-gray-900 opacity-50">
            Connect wallet
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            <a
              href="#"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Connect with one of our available wallet providers.
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 bg-white shadow-lg sm:px-10 sm:rounded-lg">
            <div className="space-y-6">
              <ul className="my-4 space-y-3">
                <li>
                  <button
                    id="metamask"
                    onClick={handleConnectWallet}
                    className="group flex items-center p-3 w-full text-base font-bold text-left text-gray-900 dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg hover:shadow"
                  >
                    <svg
                      className="h-4"
                      viewBox="0 0 40 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M39.0728 0L21.9092 12.6999L25.1009 5.21543L39.0728 0Z"
                        fill="#E17726"
                      />
                      <path
                        d="M0.966797 0.0151367L14.9013 5.21656L17.932 12.7992L0.966797 0.0151367Z"
                        fill="#E27625"
                      />
                      <path
                        d="M32.1656 27.0093L39.7516 27.1537L37.1004 36.1603L27.8438 33.6116L32.1656 27.0093Z"
                        fill="#E27625"
                      />
                      <path
                        d="M7.83409 27.0093L12.1399 33.6116L2.89876 36.1604L0.263672 27.1537L7.83409 27.0093Z"
                        fill="#E27625"
                      />
                      <path
                        d="M17.5203 10.8677L17.8304 20.8807L8.55371 20.4587L11.1924 16.4778L11.2258 16.4394L17.5203 10.8677Z"
                        fill="#E27625"
                      />
                      <path
                        d="M22.3831 10.7559L28.7737 16.4397L28.8067 16.4778L31.4455 20.4586L22.1709 20.8806L22.3831 10.7559Z"
                        fill="#E27625"
                      />
                      <path
                        d="M12.4115 27.0381L17.4768 30.9848L11.5928 33.8257L12.4115 27.0381Z"
                        fill="#E27625"
                      />
                      <path
                        d="M27.5893 27.0376L28.391 33.8258L22.5234 30.9847L27.5893 27.0376Z"
                        fill="#E27625"
                      />
                      <path
                        d="M22.6523 30.6128L28.6066 33.4959L23.0679 36.1282L23.1255 34.3884L22.6523 30.6128Z"
                        fill="#D5BFB2"
                      />
                      <path
                        d="M17.3458 30.6143L16.8913 34.3601L16.9286 36.1263L11.377 33.4961L17.3458 30.6143Z"
                        fill="#D5BFB2"
                      />
                      <path
                        d="M15.6263 22.1875L17.1822 25.4575L11.8848 23.9057L15.6263 22.1875Z"
                        fill="#233447"
                      />
                      <path
                        d="M24.3739 22.1875L28.133 23.9053L22.8184 25.4567L24.3739 22.1875Z"
                        fill="#233447"
                      />
                      <path
                        d="M12.8169 27.0049L11.9606 34.0423L7.37109 27.1587L12.8169 27.0049Z"
                        fill="#CC6228"
                      />
                      <path
                        d="M27.1836 27.0049L32.6296 27.1587L28.0228 34.0425L27.1836 27.0049Z"
                        fill="#CC6228"
                      />
                      <path
                        d="M31.5799 20.0605L27.6165 24.0998L24.5608 22.7034L23.0978 25.779L22.1387 20.4901L31.5799 20.0605Z"
                        fill="#CC6228"
                      />
                      <path
                        d="M8.41797 20.0605L17.8608 20.4902L16.9017 25.779L15.4384 22.7038L12.3988 24.0999L8.41797 20.0605Z"
                        fill="#CC6228"
                      />
                      <path
                        d="M8.15039 19.2314L12.6345 23.7816L12.7899 28.2736L8.15039 19.2314Z"
                        fill="#E27525"
                      />
                      <path
                        d="M31.8538 19.2236L27.2061 28.2819L27.381 23.7819L31.8538 19.2236Z"
                        fill="#E27525"
                      />
                      <path
                        d="M17.6412 19.5088L17.8217 20.6447L18.2676 23.4745L17.9809 32.166L16.6254 25.1841L16.625 25.1119L17.6412 19.5088Z"
                        fill="#E27525"
                      />
                      <path
                        d="M22.3562 19.4932L23.3751 25.1119L23.3747 25.1841L22.0158 32.1835L21.962 30.4328L21.75 23.4231L22.3562 19.4932Z"
                        fill="#E27525"
                      />
                      <path
                        d="M27.7797 23.6011L27.628 27.5039L22.8977 31.1894L21.9414 30.5138L23.0133 24.9926L27.7797 23.6011Z"
                        fill="#F5841F"
                      />
                      <path
                        d="M12.2373 23.6011L16.9873 24.9926L18.0591 30.5137L17.1029 31.1893L12.3723 27.5035L12.2373 23.6011Z"
                        fill="#F5841F"
                      />
                      <path
                        d="M10.4717 32.6338L16.5236 35.5013L16.4979 34.2768L17.0043 33.8323H22.994L23.5187 34.2753L23.48 35.4989L29.4935 32.641L26.5673 35.0591L23.0289 37.4894H16.9558L13.4197 35.0492L10.4717 32.6338Z"
                        fill="#C0AC9D"
                      />
                      <path
                        d="M22.2191 30.231L23.0748 30.8354L23.5763 34.8361L22.8506 34.2234H17.1513L16.4395 34.8485L16.9244 30.8357L17.7804 30.231H22.2191Z"
                        fill="#161616"
                      />
                      <path
                        d="M37.9395 0.351562L39.9998 6.53242L38.7131 12.7819L39.6293 13.4887L38.3895 14.4346L39.3213 15.1542L38.0875 16.2779L38.8449 16.8264L36.8347 19.1742L28.5894 16.7735L28.5179 16.7352L22.5762 11.723L37.9395 0.351562Z"
                        fill="#763E1A"
                      />
                      <path
                        d="M2.06031 0.351562L17.4237 11.723L11.4819 16.7352L11.4105 16.7735L3.16512 19.1742L1.15488 16.8264L1.91176 16.2783L0.678517 15.1542L1.60852 14.4354L0.350209 13.4868L1.30098 12.7795L0 6.53265L2.06031 0.351562Z"
                        fill="#763E1A"
                      />
                      <path
                        d="M28.1861 16.2485L36.9226 18.7921L39.7609 27.5398L32.2728 27.5398L27.1133 27.6049L30.8655 20.2912L28.1861 16.2485Z"
                        fill="#F5841F"
                      />
                      <path
                        d="M11.8139 16.2485L9.13399 20.2912L12.8867 27.6049L7.72971 27.5398H0.254883L3.07728 18.7922L11.8139 16.2485Z"
                        fill="#F5841F"
                      />
                      <path
                        d="M25.5283 5.17383L23.0847 11.7736L22.5661 20.6894L22.3677 23.4839L22.352 30.6225H17.6471L17.6318 23.4973L17.4327 20.6869L16.9139 11.7736L14.4707 5.17383H25.5283Z"
                        fill="#F5841F"
                      />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      MetaMask
                    </span>
                    <span className="inline-flex justify-center items-center py-0.5 px-2 ml-3 text-xs font-medium text-white dark:text-gray-400 bg-green-600 dark:bg-green-500 rounded">
                      Popular
                    </span>
                  </button>
                </li>
                {/* } <li>
                  <a
                    href="#"
                    className="group flex items-center p-3 text-base font-bold text-gray-900 dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg hover:shadow"
                  >
                    <svg
                      className="h-5"
                      viewBox="0 0 292 292"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z"
                        fill="#3259A5"
                      />
                      <path
                        d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z"
                        fill="white"
                      />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Coinbase Wallet
                    </span>
                  </a>
  </li> */}
                <li>
                  <a
                    href="#"
                    className="group flex items-center p-3 text-base font-bold text-gray-900 dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg hover:shadow"
                  >
                    <svg
                      className="h-5"
                      viewBox="0 0 512 512"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <defs>
                        <radialGradient
                          cx="0%"
                          cy="50%"
                          fx="0%"
                          fy="50%"
                          r="100%"
                          id="radialGradient-1"
                        >
                          <stop stopColor="#5D9DF6" offset="0%" />
                          <stop stopColor="#006FFF" offset="100%" />
                        </radialGradient>
                      </defs>
                      <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g id="logo">
                          <rect
                            id="base"
                            fill="url(#radialGradient-1)"
                            x={0}
                            y={0}
                            width={512}
                            height={512}
                            rx={256}
                          />
                          <path
                            d="M169.209772,184.531136 C217.142772,137.600733 294.857519,137.600733 342.790517,184.531136 L348.559331,190.179285 C350.955981,192.525805 350.955981,196.330266 348.559331,198.676787 L328.82537,217.99798 C327.627045,219.171241 325.684176,219.171241 324.485851,217.99798 L316.547278,210.225455 C283.10802,177.485633 228.89227,177.485633 195.453011,210.225455 L186.951456,218.549188 C185.75313,219.722448 183.810261,219.722448 182.611937,218.549188 L162.877976,199.227995 C160.481326,196.881474 160.481326,193.077013 162.877976,190.730493 L169.209772,184.531136 Z M383.602212,224.489406 L401.165475,241.685365 C403.562113,244.031874 403.562127,247.836312 401.165506,250.182837 L321.971538,327.721548 C319.574905,330.068086 315.689168,330.068112 313.292501,327.721609 C313.292491,327.721599 313.29248,327.721588 313.29247,327.721578 L257.08541,272.690097 C256.486248,272.103467 255.514813,272.103467 254.915651,272.690097 C254.915647,272.690101 254.915644,272.690105 254.91564,272.690108 L198.709777,327.721548 C196.313151,330.068092 192.427413,330.068131 190.030739,327.721634 C190.030725,327.72162 190.03071,327.721606 190.030695,327.721591 L110.834524,250.181849 C108.437875,247.835329 108.437875,244.030868 110.834524,241.684348 L128.397819,224.488418 C130.794468,222.141898 134.680206,222.141898 137.076856,224.488418 L193.284734,279.520668 C193.883897,280.107298 194.85533,280.107298 195.454493,279.520668 C195.454502,279.520659 195.45451,279.520651 195.454519,279.520644 L251.65958,224.488418 C254.056175,222.141844 257.941913,222.141756 260.338618,224.488222 C260.338651,224.488255 260.338684,224.488288 260.338717,224.488321 L316.546521,279.520644 C317.145683,280.107273 318.117118,280.107273 318.71628,279.520644 L374.923175,224.489406 C377.319825,222.142885 381.205562,222.142885 383.602212,224.489406 Z"
                            id="WalletConnect"
                            fill="#FFFFFF"
                            fillRule="nonzero"
                          />
                        </g>
                      </g>
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      WalletConnect
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group flex items-center p-3 text-base font-bold text-gray-900 dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg hover:shadow"
                  >
                    <svg
                      className="h-4"
                      viewBox="0 0 96 96"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M72.0998 0.600098H48.3998H24.5998H0.799805V24.4001V48.2001V49.7001V71.8001V71.9001V95.5001H24.5998V72.0001V71.9001V49.8001V48.3001V24.5001H48.3998H72.1998H95.9998V0.700104H72.0998V0.600098Z"
                        fill="#617BFF"
                      />
                      <path
                        d="M48.5 71.8002H72.1V95.6002H73C79.1 95.6002 84.9 93.2002 89.2 88.9002C93.5 84.6002 95.9 78.8002 95.9 72.7002V48.2002H48.5V71.8002Z"
                        fill="#617BFF"
                      />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Fortmatic
                    </span>
                  </a>
                </li>
              </ul>
              <div>
                <a
                  href="#"
                  className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400 hover:underline"
                >
                  <svg
                    className="mr-2 w-3 h-3"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="question-circle"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                    />
                  </svg>
                  Why do I need to connect with my wallet?
                </a>
              </div>
            </div>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Twitter</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Auth>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  // const csrfToken = await getCsrfToken(context)
  return {
    props: { providers },
  };
};
