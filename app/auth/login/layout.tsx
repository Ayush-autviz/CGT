'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
 // Adjust path as needed

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // If user exists, redirect to main page
    if (user) {
      router.push('/main');
    }
  }, [user, router]);

  return (
    <div className="max-h-screen">
      {children}
    </div>
  );
}