import { useEffect, useRef } from 'react';

import Jazzicon from '@sekmet/jazzicon';
import { useEthers } from '@usedappify/core';

export default function Identicon({
  accountId,
  iconSize = 36,
}: {
  accountId: string;
  iconSize: number;
}) {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();
  const accountUser = accountId || account;

  useEffect(() => {
    if (accountUser && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild<any>(
        Jazzicon(iconSize, parseInt(accountUser.slice(2, 10), iconSize))
      );
    }
  }, [accountUser]);

  return (
    <div
      style={{ borderRadius: '1.125rem', backgroundColor: 'transparent' }}
      ref={ref as any}
    />
  );
}
