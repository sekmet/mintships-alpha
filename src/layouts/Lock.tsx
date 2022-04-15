import React, { ReactNode } from 'react';

import Navbar from '@/components/Navbars/LockNavbar';

type IAuthProps = {
  meta?: ReactNode;
  children: ReactNode;
};

const Lock = (props: IAuthProps) => {
  return (
    <>
      {props.meta}
      <Navbar />
      <main>
        <section className="relative py-20 w-full h-full min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-gray-800 bg-full"
            style={{
              backgroundImage: "url('/assets/images/Earth.jpeg')",
            }}
          ></div>
          {props.children}
        </section>
      </main>
    </>
  );
};

export { Lock };
