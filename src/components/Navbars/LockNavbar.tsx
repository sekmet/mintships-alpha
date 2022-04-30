import React from 'react';

import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <nav className="flex absolute top-0 z-50 flex-wrap justify-between items-center py-3 px-2 w-full navbar-expand-lg">
        <div className="container flex flex-wrap justify-between items-center px-4 mx-auto">
          <div className="flex relative justify-between w-full lg:block lg:static lg:justify-start lg:w-auto">
            <Link href="/">
              <a
                className="inline-block py-2 mr-4 text-xl font-bold leading-relaxed text-white uppercase whitespace-nowrap opacity-50"
                id="home"
              >
                MINTSHIPS ALPHA
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
