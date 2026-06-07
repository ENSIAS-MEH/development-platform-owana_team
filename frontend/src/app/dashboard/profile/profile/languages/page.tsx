'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LanguagesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/profile/profile');
  }, [router]);
  return null;
}
