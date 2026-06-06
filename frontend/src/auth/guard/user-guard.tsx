'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/shared/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

/**
 * UserGuard — wraps all /dashboard/* routes.
 *
 * Behaviour:
 *  - Not authenticated → redirect to sign-in
 *  - Authenticated as ADMIN → redirect to /admin (admin has their own layout)
 *  - Authenticated as USER → render children
 */
export function UserGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading, user } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = useCallback(async () => {
    if (loading) return;

    if (!authenticated) {
      const href = `${paths.auth.jwt.signIn}?${createQueryString('returnTo', pathname)}`;
      router.replace(href);
      return;
    }

    // Admin should never land on /dashboard — send them to their panel
    if (user?.role === 'ADMIN') {
      router.replace(paths.admin.root);
      return;
    }

    setIsChecking(false);
  }, [loading, authenticated, user?.role, router, pathname, createQueryString]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) return <SplashScreen />;

  return <>{children}</>;
}
