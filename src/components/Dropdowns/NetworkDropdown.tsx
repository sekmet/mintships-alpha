import { Fragment, useState, useEffect } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

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
    id: 80001,
    name: 'Polygon Mumbai',
    thumbnail: '/assets/images/POLYGON.jpg',
  },
  {
    id: 137,
    name: 'Polygon Mainnet',
    thumbnail: '/assets/images/POLYGON.jpg',
  },
];

export function classNames(...classes: string[]): string | undefined {
  return classes.filter(Boolean).join(' ');
}

export default function NetworkDropdown(props: any) {
  const { chainId, setChainId } = props;
  const [selectedItem, setSelectedItem] = useState<
    undefined | IConnectedNetwork | IConnectedNetwork[]
  >(networksAvailble.filter((x) => String(x.id) === chainId));

  useEffect(() => {
    if (chainId) {
      const network = networksAvailble.filter((x) => String(x.id) === chainId);
      setSelectedItem(network[0] as IConnectedNetwork);
    }
  }, [chainId]);

  return (
    <Listbox
      value={selectedItem as IConnectedNetwork}
      onChange={(e: IConnectedNetwork) => {
        setSelectedItem(e);
        setChainId(e?.id);
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
