'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This route no longer exists — redirect to dashboard home
export default function AccountsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard'); }, [router]);
  return null;
}
