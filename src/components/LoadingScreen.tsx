"use client";

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

// Dynamically import lottie-react for SSR safety
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetch the Lottie JSON from the public directory
    fetch("/_116_NFT.json")
      .then((res) => res.json())
      .then(setAnimationData);

    // Start fade out after 15s
    const timer = setTimeout(() => setFadeOut(true), 15000);
    // Remove overlay after fade out duration (e.g., 0.7s)
    const removeTimer = setTimeout(() => setShowOverlay(false), 15700);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showOverlay && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-700 ${
            fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
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
      )}
      {children}
    </>
  );
} 