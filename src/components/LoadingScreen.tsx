"use client";

import { useEffect, useState } from 'react';

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6" />
        <div className="text-xl font-bold text-foreground mb-2">Loading Gift Catalog...</div>
        <div className="text-sm text-muted-foreground">Please wait</div>
      </div>
    );
  }

  return <>{children}</>;
} 