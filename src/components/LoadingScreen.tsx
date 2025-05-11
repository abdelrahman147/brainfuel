"use client";

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

// Dynamically import lottie-react for SSR safety
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetch the Lottie JSON from the public directory
    fetch("/_116_NFT.json")
      .then((res) => res.json())
      .then(setAnimationData);

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-6 w-32 h-32 flex items-center justify-center">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: 128, height: 128 }}
            />
          )}
        </div>
        <div className="text-xl font-bold text-foreground mb-2">Loading Gift Catalog...</div>
        <div className="text-sm text-muted-foreground">Please wait</div>
      </div>
    );
  }

  return <>{children}</>;
} 