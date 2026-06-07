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
 * AdminGuard — wraps all /admin/* routes.
 *
 * Behaviour:
 *  - Loading → show splash screen
 *  - Not authenticated → redirect to sign-in with returnTo
 *  - Authenticated but role !== ADMIN → redirect to /dashboard (not an admin)
 *  - Authenticated + ADMIN → render children
 */
export function AdminGuard({ children }: Props) {
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

    // Authenticated but not admin → redirect to regular dashboard
    if (user?.role !== 'ADMIN') {
      router.replace(paths.dashboard.root);
      return;
    }

    setIsChecking(false);
  }, [loading, authenticated, user, router, pathname, createQueryString]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) return <SplashScreen />;

  return <>{children}</>;
}
