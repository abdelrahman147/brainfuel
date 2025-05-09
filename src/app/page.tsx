'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { CatalogSection } from '@/components/catalog-section'
import { DonationSection } from '@/components/donation-section'
import { Pagination } from '@/components/pagination'
import { getTelegramWebApp } from '@/lib/telegram'
import { ProfileSection } from '@/components/profile-section'
import Player from 'lottie-react'
import duckAnimation from '../../duck_invitation.json'

function ComingSoonSection() {
  const tg = getTelegramWebApp()

  // Handle Telegram channel link click
  const handleChannelClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const url = "https://t.me/GiftCatlog"

    // Use Telegram's openLink method if available to prevent mini app from closing
    if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
      (window as any).Telegram.WebApp.openLink(url)
    } else {
      // Fallback for non-Telegram environments
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Coming Soon Info Card */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
            {/* Fix for the watch element - Improved clock icon */}
            <svg
              className="w-16 h-16 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>

            {/* Outer rotating ring */}
            <div className="absolute inset-0">
              <svg
                className="w-24 h-24 text-amber-500/30 animate-spin-slow"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  pathLength="100"
                  strokeLinecap="round"
                  strokeDasharray="10 15"
                  strokeDashoffset="0"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Coming Soon
          </h2>

          <p className="text-muted-foreground text-center max-w-lg mb-4">
            We're building exciting new features and collections for the Gift Catalog community. Stay tuned for updates!
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Partners */}
        <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-5 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 hover:shadow-lg transition-all duration-300 flex flex-col animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="p-4 rounded-lg mb-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 animate-pulse-soft">
            <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Partners Program</h3>
          <p className="text-muted-foreground text-sm flex-grow">
            Partner with our project to promote your channel and create more immersive experiences for your community. Join our partnership program to gain visibility and exclusive benefits.
          </p>
          <div className="flex justify-between mt-4 items-center">
            <a
              href="https://t.me/yousefmsm1"
              onClick={(e) => {
                e.preventDefault()
                if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
                  (window as any).Telegram.WebApp.openLink("https://t.me/yousefmsm1")
                } else {
                  window.open("https://t.me/yousefmsm1", '_blank')
                }
              }}
              className="text-xs text-purple-500 hover:underline transition-all duration-300 hover:text-purple-600"
            >
              Contact @yousefmsm1
            </a>
            <span className="text-xs px-3 py-1 bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400 rounded-full">Coming Soon</span>
          </div>
        </div>

        {/* Collection Viewer */}
        <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-5 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 hover:shadow-lg transition-all duration-300 flex flex-col animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="p-4 rounded-lg mb-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 animate-pulse-soft">
            <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Collection Viewer</h3>
          <p className="text-muted-foreground text-sm flex-grow">
            Explore collections in an immersive, visually rich interface. Discover exclusive Devil or Angel collections and browse through detailed attributes with our elegant gallery view.
          </p>
          <div className="flex justify-end mt-4">
            <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 rounded-full">Coming Soon</span>
          </div>
        </div>

        {/* Gift Forbes */}
        <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-5 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 hover:shadow-lg transition-all duration-300 flex flex-col animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="p-4 rounded-lg mb-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 animate-pulse-soft">
            <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Gift Forbes</h3>
          <p className="text-muted-foreground text-sm flex-grow">
            Your definitive dashboard for Telegram's most prestigious NFT profiles. Track top collectors, discover trending collections, and gain insights into the most valuable NFTs in the community.
          </p>
          <div className="flex justify-end mt-4">
            <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in" style={{ animationDelay: '300ms' }}>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>

          <a
            href="https://t.me/GiftCatlog"
            onClick={handleChannelClick}
            className="flex items-center justify-center w-full sm:w-auto bg-amber-500 hover:bg-amber-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-300 rounded-lg py-3 px-6 text-sm font-medium text-white transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.665,3.717l-17.73,6.837c-1.21,0.486-1.203,1.161-0.222,1.462l4.552,1.42l10.532-6.645c0.498-0.303,0.953-0.14,0.579,0.192l-8.533,7.701l0,0l0,0H9.841l0.002,0.001l-0.314,4.692c0.46,0,0.663-0.211,0.921-0.46l2.211-2.15l4.599,3.397c0.848,0.467,1.457,0.227,1.668-0.785l3.019-14.228c0.309-1.239-0.473-1.8-1.282-1.434z" />
            </svg>
            Follow Our Channel
          </a>

          <p className="text-xs text-muted-foreground mt-4">
            Be the first to know when these exciting features launch!
          </p>
        </div>
      </div>
    </div>
  )
}

function InviteSection() {
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user;
  const [referralLink, setReferralLink] = useState('https://yourapp.com/ref/USERID');

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      setReferralLink(`${window.location.origin}/ref/${user.id}`);
    }
  }, [user]);

  const invitedUsers: { name: string; photoUrl: string }[] = [];

  const handleCopy = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      if (tg && typeof (window as any).Telegram?.WebApp?.showPopup === 'function') {
        (window as any).Telegram.WebApp.showPopup({ message: 'Link copied!' });
      }
    } catch {
      if (tg && typeof (window as any).Telegram?.WebApp?.showPopup === 'function') {
        (window as any).Telegram.WebApp.showPopup({ message: 'Failed to copy link' });
      }
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;

    if (tg && typeof (window as any).Telegram?.WebApp?.shareLink === 'function') {
      (window as any).Telegram.WebApp.shareLink(referralLink, { title: 'Invite to GiftCatalog' });
    } else if (navigator.share) {
      navigator.share({ title: 'Invite to GiftCatalog', url: referralLink });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Invite Info Card */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
            <Player
              animationData={duckAnimation}
              style={{ width: '100%', height: '100%' }}
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
            />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Invite Friends
          </h2>

          <p className="text-muted-foreground text-center max-w-lg mb-4">
            Share your referral link with friends and earn rewards when they join the Gift Catalog community!
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>

          <div className="w-full max-w-md flex items-center space-x-2 mb-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-transparent p-2 rounded-lg text-sm text-foreground border border-border dark:border-border/30 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="p-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-300 rounded-lg text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-full sm:w-auto bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-300 rounded-lg py-3 px-6 text-sm font-medium text-white transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share Link
          </button>
        </div>
      </div>

      {/* Invited Users Card */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Invited Friends</h3>

          {invitedUsers.length > 0 ? (
            <div className="w-full max-w-md space-y-4">
              {invitedUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/20 dark:bg-muted/10 rounded-lg">
                  <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                  <span className="text-sm text-foreground">{user.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No friends invited yet. Share your link to start earning rewards!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('catalog')

  const renderContent = () => {
    switch (activeTab) {
      case 'catalog':
        return <CatalogSection />
      case 'donate':
        return <DonationSection />
      case 'invite':
        return <InviteSection />
      case 'coming-soon':
        return <ComingSoonSection />
      default:
        return <CatalogSection />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 font-sans text-sm">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
