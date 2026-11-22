'use client';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { GATEWAY_API_URL } from 'src/config-global';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const res = await axios.post(`${GATEWAY_API_URL}${endpoints.auth.login}`, { email, password });

    const { accessToken, refreshToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);

    // Persist refresh token for later token renewal
    sessionStorage.setItem('jwt_refresh_token', refreshToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUpWithPassword = async ({ email, password }: SignUpParams): Promise<void> => {
  try {
    const res = await axios.post(`${GATEWAY_API_URL}${endpoints.auth.register}`, {
      email,
      password,
    });

    const { accessToken, refreshToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);

    sessionStorage.setItem('jwt_refresh_token', refreshToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    const refreshToken = sessionStorage.getItem('jwt_refresh_token');

    if (refreshToken) {
      try {
        await axios.post(`${GATEWAY_API_URL}${endpoints.auth.logout}`, { refreshToken });
      } catch {
        // Proceed with local logout even if the server call fails
      }
    }

    setSession(null);
    sessionStorage.removeItem('jwt_refresh_token');
    window.location.href = paths.auth.jwt.signIn;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
