import { Fragment, useState, useEffect } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

import { classNames, getProviderByChainId, getRandomElement } from '@/utils';

type IConnectedNetwork = {
  id: number;
  name: string;
  thumbnail: string;
};

const networksAvailble = [
  {
    id: 1,
    name: 'Ethereum MainNet',
    thumbnail: '/assets/images/ETH.jpg',
  },
  {
    id: 4,
    name: 'Ethereum Rinkeby',
    thumbnail: '/assets/images/ETH.jpg',
  },
  {
    id: 5,
    name: 'Ethereum Goerli',
    thumbnail: '/assets/images/ETH.jpg',
  },
  {
    id: 42,
    name: 'Ethereum Kovan',
    thumbnail: '/assets/images/ETH.jpg',
  },
  {
    id: 56,
    name: 'Binance Chain Mainnet',
    thumbnail: '/assets/images/binance.jpg',
  },
  {
    id: 97,
    name: 'Binance Chain Testnet',
    thumbnail: '/assets/images/binance.jpg',
  },
  {
    id: 80001,
    name: 'Polygon Mumbai',
    thumbnail: '/assets/images/POLYGON.jpg',
  },
  {
    id: 137,
    name: 'Polygon Mainnet',
    thumbnail: '/assets/images/POLYGON.jpg',
  },
  {
    id: 1666600000,
    name: 'Harmony S0',
    thumbnail: '/assets/images/harmony.jpg',
  },
  {
    id: 1666700000,
    name: 'Harmony Testnet S0',
    thumbnail: '/assets/images/harmony.jpg',
  },
  {
    id: 25,
    name: 'Cronos Mainnet Beta',
    thumbnail: '/assets/images/cronos.png',
  },
  {
    id: 338,
    name: 'Cronos Testnet',
    thumbnail: '/assets/images/cronos.png',
  },
  {
    id: 1284,
    name: 'Moonbeam',
    thumbnail: '/assets/images/moonbeam.png',
  },
  {
    id: 1287,
    name: 'Moonbase Alpha',
    thumbnail: '/assets/images/moonbeam.png',
  },
  {
    id: 1285,
    name: 'Moonriver',
    thumbnail: '/assets/images/moonriver.png',
  },
  {
    id: 250,
    name: 'Fantom Opera',
    thumbnail: '/assets/images/fantom.png',
  },
  {
    id: 4002,
    name: 'Fantom Testnet',
    thumbnail: '/assets/images/fantom.png',
  },
  {
    id: 43114,
    name: 'Avalanche',
    thumbnail: '/assets/images/avax.png',
  },
  {
    id: 43113,
    name: 'Fuji Testnet',
    thumbnail: '/assets/images/avax.png',
  },
  {
    id: 1313161554,
    name: 'Aurora',
    thumbnail: '/assets/images/aurora.jpg',
  },
  {
    id: 1313161555,
    name: 'Aurora Testnet',
    thumbnail: '/assets/images/aurora.jpg',
  },
  {
    id: 28,
    name: 'Boba Network Rinkeby Testnet',
    thumbnail: '/assets/images/boba.png',
  },
  {
    id: 288,
    name: 'Boba Network',
    thumbnail: '/assets/images/boba.png',
  },
];

export default function NetworkDropdown(props: any) {
  const { chainId, setChainId, verifyContract } = props;
  const [selectedItem, setSelectedItem] = useState<
    undefined | IConnectedNetwork | IConnectedNetwork[]
  >(networksAvailble.filter((x) => String(x.id) === chainId));

  useEffect(() => {
    if (chainId) {
      const network = networksAvailble.filter((x) => String(x.id) === chainId);
      setSelectedItem(network[0] as IConnectedNetwork);
      if (network[0])
        verifyContract(
          getRandomElement(getProviderByChainId(String(network[0].id)))
        );
    }
  }, [chainId, setChainId]);

  return (
    <Listbox
      value={selectedItem as IConnectedNetwork}
      onChange={(e: IConnectedNetwork) => {
        setChainId(e?.id);
        setSelectedItem(e);
        if (e.id)
          verifyContract(getRandomElement(getProviderByChainId(String(e.id))));
      }}
    >
      {({ open }) => {
        const { thumbnail, name } = selectedItem as IConnectedNetwork;
        return (
          <>
            <div className="relative mt-1">
              <Listbox.Button className="relative py-2 pr-10 pl-3 w-full text-left bg-white rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm cursor-default sm:text-sm">
                <span className="flex items-center">
                  <img
                    src={thumbnail}
                    alt=""
                    className="shrink-0 w-6 h-6 rounded-full"
                  />
                  <span className="block ml-3 truncate">{name}</span>
                </span>
                <span className="flex absolute inset-y-0 right-0 items-center pr-2 ml-3 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-56 text-base bg-white rounded-md focus:outline-none ring-1 ring-black ring-opacity-5 shadow-lg sm:text-sm">
                  {networksAvailble.map((network) => (
                    <Listbox.Option
                      key={network.id}
                      className={({ active }): any =>
                        classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={network}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={network.thumbnail}
                              alt=""
                              className="shrink-0 w-6 h-6 rounded-full"
                            />
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'ml-3 block truncate'
                              )}
                            >
                              {network.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        );
      }}
    </Listbox>
  );
}
