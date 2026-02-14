'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useCurrentUser } from '@/hooks/api/auth';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  const { isLoading: isUserLoading } = useCurrentUser();

  useEffect(() => {
    // Skip if still loading
    if (isLoading || isUserLoading) return;

    const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

    // Redirect to login if not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }

    // Redirect to todos if authenticated and trying to access auth routes
    if (isAuthenticated && isPublicRoute) {
      router.push('/todos');
    }
  }, [isAuthenticated, isLoading, isUserLoading, pathname, router]);

  return {
    isAuthenticated,
    isLoading: isLoading || isUserLoading,
    user,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}
