import React, { ReactNode, useEffect, useState } from 'react';

import Navbar from '@/components/Navbars/LockNavbar';

type IAuthProps = {
  meta?: ReactNode;
  children: ReactNode;
  bg?: string;
};

const Lock = (props: IAuthProps) => {
  const [randomBg, setRandomBg] = useState<string>('bg-white');
  useEffect(() => {
    const randBg = (): string => {
      const bgs = [
        'bg-gradient-to-r from-indigo-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-indigo-500',
        'bg-gradient-to-r from-pink-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-pink-500',
        'bg-gradient-to-r from-orange-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-orange-500',
        'bg-gradient-to-r from-yellow-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-yellow-500',
        'bg-gradient-to-r from-green-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-green-500',
        'bg-gradient-to-r from-blue-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-blue-500',
        'bg-gradient-to-r from-red-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-red-500',
        'bg-gradient-to-r from-yellow-400 via-gray-50 to-teal-300',
        'bg-gradient-to-r from-teal-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-teal-500',
        'bg-gradient-to-r from-gray-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-gray-500',
        'bg-gradient-to-r from-indigo-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-indigo-500',
        'bg-gradient-to-r from-slate-500 to-yellow-100',
        'bg-gradient-to-r from-pink-500 to-purple-500',
        'bg-gradient-to-r from-purple-500 to-pink-500',
      ];
      return String(bgs[Math.floor(Math.random() * bgs.length)]);
    };
    setRandomBg(randBg());
  }, []);

  return (
    <>
      {props.meta}
      <Navbar />
      <main>
        <section className="relative py-20 w-full h-full min-h-screen">
          <div
            className={`absolute top-0 w-full h-full bg-full ${
              props?.bg ? '' : randomBg
            }`}
            style={{ backgroundColor: props?.bg ? `#${props?.bg}` : '' }}
          ></div>
          {props.children}
        </section>
      </main>
    </>
  );
};

export { Lock };
