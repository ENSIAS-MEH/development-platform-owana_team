'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/shared/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, authenticated, user } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) return;

    if (authenticated) {
      // If there is a returnTo param, respect it
      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        router.replace(returnTo);
        return;
      }

      // Route admin to admin panel, regular users to feed
      const destination = user?.role === 'ADMIN' ? paths.admin.root : paths.dashboard.feed.root;
      router.replace(destination);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, user?.role]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
