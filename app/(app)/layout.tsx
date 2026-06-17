"use client";

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/app/_components/AuthProvider';
import { AppShell } from '@/app/_components/AppShell';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  if (!user.onboarding_completed) {
    router.push('/onboarding');
    return null;
  }

  return <AppShell>{children}</AppShell>;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>{children}</AuthGuard>
  );
}
}
