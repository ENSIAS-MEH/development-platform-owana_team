'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { GATEWAY_API_URL } from 'src/config-global';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { jwtDecode, setSession, isValidToken } from './utils';
import { signOut as signOutAction } from './action';
import { extractApiError } from 'src/utils/api-error';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  // ------------------------------------------------------------------
  // Session check
  //
  // Flow:
  //   1. Try GET /api/users/me  (returns UserProfileResponse for USER role)
  //   2. On success → merge profile data + role from JWT into user state
  //   3. On 404 (profile not found — happens for ADMIN who has no profile row)
  //      → fall back to JWT claims only (userId, email, role)
  //      → admin is still authenticated and can access their pages
  //   4. On any other error → clear session (truly unauthenticated)
  // ------------------------------------------------------------------
  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (!accessToken || !isValidToken(accessToken)) {
        setState({ user: null, loading: false });
        return;
      }

      setSession(accessToken);

      // Decode JWT to get role, userId, email regardless of profile existence
      const decoded = jwtDecode(accessToken) as {
        sub?: string;        // email (Spring Security sets sub = email)
        userId?: string;
        role?: string;
        exp?: number;
      } | null;

      const roleFromJwt = decoded?.role ?? 'USER';
      const emailFromJwt = decoded?.sub ?? '';
      const userIdFromJwt = decoded?.userId ?? '';

      // Build the minimal user object from JWT — always valid for admin
      const jwtUser = {
        userId: userIdFromJwt,
        email: emailFromJwt,
        role: roleFromJwt,
        isAdmin: roleFromJwt === 'ADMIN',
        accessToken,
      };

      // Try to enrich with a full profile from user-service.
      // On any failure (404 for admin, or transient error) fall back to JWT user.
      let profile: Record<string, unknown> | null = null;
      try {
        const res = await axios.get(`${GATEWAY_API_URL}${endpoints.users.me}`);
        profile = res.data;
      } catch {
        // 404 = no profile (expected for admin).
        // Any other error = use JWT claims as fallback.
        profile = null;
      }

      if (profile) {
        setState({
          user: {
            ...profile,
            accessToken,
            role: roleFromJwt,
            isAdmin: roleFromJwt === 'ADMIN',
            userId: userIdFromJwt || (profile.userId as string),
          },
          loading: false,
        });
      } else {
        // Admin or profile-less user — authenticated via JWT alone
        setState({ user: jwtUser, loading: false });
      }
    } catch (error) {
      console.error('checkUserSession error:', error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Forgot password
  // ------------------------------------------------------------------
  const forgotPassword = useCallback(async (email: string) => {
    try {
      await axios.post(`${GATEWAY_API_URL}${endpoints.auth.forgotPassword}`, { email });
    } catch (error: any) {
      throw new Error(extractApiError(error));
    }
  }, []);

  // ------------------------------------------------------------------
  // Reset password
  // ------------------------------------------------------------------
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await axios.post(`${GATEWAY_API_URL}${endpoints.auth.resetPassword}`, {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(extractApiError(error));
    }
  }, []);

  // ------------------------------------------------------------------
  // Change password
  // ------------------------------------------------------------------
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      await axios.put(
        `${GATEWAY_API_URL}${endpoints.auth.changePassword}`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error: any) {
      throw new Error(extractApiError(error));
    }
  }, []);

  // ------------------------------------------------------------------
  // Sign out
  // ------------------------------------------------------------------
  const signOut = useCallback(async () => {
    await signOutAction();
    setState({ user: null, loading: false });
  }, [setState]);

  // ------------------------------------------------------------------
  // Derived status
  // ------------------------------------------------------------------
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'USER',
            isAdmin: (state.user?.role ?? 'USER') === 'ADMIN',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      forgotPassword,
      resetPassword,
      changePassword,
      signOut,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
