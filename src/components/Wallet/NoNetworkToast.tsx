function NoNetwork(chainId: number) {
  if (chainId)
    return (
      <div
        id="toast-warning"
        className="flex absolute top-0 right-0 z-50 items-center p-4 mt-3 mr-3 w-full max-w-xs text-white dark:text-gray-400 bg-orange-600 dark:bg-gray-800 rounded-lg shadow"
        role="alert"
      >
        <div className="inline-flex shrink-0 justify-center items-center w-8 h-8 text-orange-500 dark:text-orange-200 bg-orange-200 dark:bg-orange-700 rounded-lg">
          <svg
            className="w-10 h-10"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 text-sm font-bold">
          Wrong network, please switch to the network chain {chainId}.
        </div>
        <button
          type="button"
          className="inline-flex p-1.5 -m-1.5 ml-auto w-8 h-8 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-300"
          data-dismiss-target="#toast-warning"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  return <></>;
}

export default NoNetwork;
