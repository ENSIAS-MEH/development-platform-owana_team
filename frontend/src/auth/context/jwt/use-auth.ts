'use client';

import type { AuthContextValue } from 'src/auth/types';

import { useContext } from 'react';

import { AuthContext } from '../auth-context';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
