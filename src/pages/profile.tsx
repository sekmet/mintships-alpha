import { useEffect } from 'react';

import { useEthers } from '@usedappify/core';
import { useRouter } from 'next/router';

import { Dashboard } from '@/layouts/Dashboard';
import { Meta } from '@/layouts/Meta';

declare let window: any;

const Profile = () => {
  const router = useRouter();
  const { account } = useEthers();

  useEffect(() => {
    // console.log(thumbnailUrl);
    window.ethereum.on('accountsChanged', function () {
      router.reload();
    });
    window.ethereum.on('networkChanged', function () {
      router.reload();
    });
  }, []);

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
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="py-5 px-4 space-y-2 bg-white sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Address
                    </label>
                    <div className="flex mt-1">
                      <span className="py-0.5 px-2.5 mr-2 text-xs font-semibold text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200 rounded">
                        {account || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Profile;
