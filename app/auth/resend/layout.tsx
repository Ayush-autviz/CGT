import { Suspense } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-[#0A0F1D] items-center justify-center">Loading...</div>}>
      {children}
    </Suspense>
  );
}