import { ReactNode, ReactElement } from 'react';

import { useSession } from 'next-auth/react';

import Header from '@/layouts/Header';
import Nav from '@/layouts/Nav';

// import type { Session } from 'next-auth';
type IAuthProps = {
  children: ReactElement<any, any>;
};

const AuthApp = (props: IAuthProps) => {
  const { data, status }: any = useSession({ required: true });
  const isUser = !!data?.session?.user;

  if (isUser) {
    return props.children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  console.log(data, status);
  return <div>Loading...</div>;
};

type IDashboardProps = {
  meta: ReactNode;
  children: ReactNode;
  auth: boolean;
};

const Dashboard = (props: IDashboardProps) => (
  <AuthApp>
    <>
      {props.meta}
      <div className="min-h-full">
        <Nav />
        <Header />
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="py-6 px-4 sm:px-0">{props.children}</div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  </AuthApp>
);

export { Dashboard };
