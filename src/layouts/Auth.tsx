import { Fragment, ReactNode, useEffect, useState } from 'react';

type IAuthProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Auth = (props: IAuthProps) => {
  const [randomBg, setRandomBg] = useState<string>('bg-gray-100');
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
        'bg-conic-to-bl from-fuchsia-300 via-green-400 to-rose-700',
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
  console.log(randomBg);
  return (
    <Fragment>
      {props.meta}
      <div className={`min-h-full h-screen ${randomBg}`}>
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="py-6 px-4 sm:px-0">{props.children}</div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export { Auth };
