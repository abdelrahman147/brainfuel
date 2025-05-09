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
  const referralLink = typeof window !== 'undefined' && user
    ? `${window.location.origin}/ref/${user.id}`
    : 'https://yourapp.com/ref/USERID';

  const invitedUsers: { name: string; photoUrl: string }[] = [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.showPopup) {
        (window as any).Telegram.WebApp.showPopup({ message: 'Link copied!' });
      }
    } catch {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.showPopup) {
        (window as any).Telegram.WebApp.showPopup({ message: 'Failed to copy link' });
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.shareLink) {
      (window as any).Telegram.WebApp.shareLink(referralLink, { title: 'Invite to GiftCatalog' });
    } else if (navigator.share) {
      navigator.share({ title: 'Invite to GiftCatalog', url: referralLink });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in">
      {/* Duck Animation */}
      <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg mb-2 flex items-center justify-center bg-white dark:bg-muted">
        <Player 
          animationData={duckAnimation} 
          style={{ width: '100%', height: '100%' }} 
          loop 
          autoplay 
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      </div>
      {/* Title */}
      <h2 className="text-2xl font-bold text-center">Referral Program</h2>
      {/* Description */}
      <p className="text-center text-base text-muted-foreground max-w-xs mb-2">
        Invite friends and earn <b>Points</b> rewards and to convert them to <b>TON</b><br />
        from their activity in <b>(Disclosed)</b>.
      </p>
      {/* Invite Button Row */}
      <div className="flex w-full max-w-md mb-2">
        <button
          className="flex-1 font-semibold py-3 rounded-l-xl text-lg transition-colors duration-200 bg-blue-500 text-white"
          onClick={handleShare}
        >
          Invite Friends
        </button>
        <button
          className="bg-blue-500 text-white px-4 rounded-r-xl flex items-center justify-center transition-colors duration-200"
          onClick={handleCopy}
          aria-label="Copy referral link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
      </div>
      {/* Profit Referrals */}
      <div className="w-full max-w-md text-xs font-semibold mb-1">PROFIT REFERRALS: 0</div>
      {/* Empty State */}
      <div className="w-full max-w-md bg-muted/20 rounded-xl py-6 text-center text-muted-foreground">
        You haven't invited any friends yet
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'donation' | 'soon' | 'profile' | 'invite'>('catalog')

  useEffect(() => {
    // Add the scrollbar-hide utility class CSS and animations
    const style = document.createElement('style')
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-out-down {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.3s ease-out;
      }
      .animate-fade-out-down {
        animation: fade-out-down 0.3s ease-out;
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      @keyframes page-transition {
        0% { opacity: 0; transform: translateX(20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .page-enter {
        animation: page-transition 0.3s ease-out forwards;
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
      }
      @keyframes scale-in {
        0% { opacity: 0; transform: scale(0.95);}
        100% { opacity: 1; transform: scale(1);}
      }
      .animate-scale-in {
        animation: scale-in 0.5s cubic-bezier(0.4,0,0.2,1) both;
      }
      @keyframes slide-up {
        0% { opacity: 0; transform: translateY(30px);}
        100% { opacity: 1; transform: translateY(0);}
      }
      .animate-slide-up {
        animation: slide-up 0.6s cubic-bezier(0.4,0,0.2,1) both;
      }
      @keyframes pulse-soft {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .animate-pulse-soft {
        animation: pulse-soft 2s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'catalog':
        return (
          <div key="catalog" className="page-enter">
            <CatalogSection />
            <Pagination />
          </div>
        )
      case 'donation':
        return (
          <div key="donation" className="page-enter">
            <DonationSection />
          </div>
        )
      case 'profile':
        return (
          <div key="profile" className="page-enter">
            <ProfileSection />
          </div>
        )
      case 'soon':
        return (
          <div key="soon" className="page-enter">
            <ComingSoonSection />
          </div>
        )
      case 'invite':
        return (
          <div key="invite" className="page-enter">
            <InviteSection />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-2 py-4 max-w-7xl">
      {activeTab === 'catalog' && <Header />}

      <main className="pb-20 sm:pb-0">
        {renderContent()}
      </main>

      {/* Mobile bottom navigation - updated with better visibility and z-index */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 flex bg-white dark:bg-[#141824] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] sm:hidden border-t border-border/20 dark:border-border/10">
        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
            activeTab === 'catalog' ? 'text-accent dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('catalog')}
          aria-label="catalog tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs">Catalog</span>
        </button>

        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
            activeTab === 'donation' ? 'text-accent dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('donation')}
          aria-label="donation tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 300.346 300.346">
            <path d="M296.725,153.904c-3.612-5.821-9.552-9.841-16.298-11.03c-6.753-1.189-13.704,0.559-19.14,4.835l-21.379,17.125 c-3.533-3.749-8.209-6.31-13.359-7.218c-6.746-1.189-13.703,0.559-19.1,4.805l-12.552,9.921h-32.236 c-5.152,0-10.302-1.238-14.892-3.579l-11.486-5.861c-9.678-4.937-20.537-7.327-31.385-6.908 c-15.046,0.579-29.449,6.497-40.554,16.666L2.455,229.328c-2.901,2.656-3.28,7.093-0.873,10.203l32.406,41.867 c1.481,1.913,3.714,2.933,5.983,2.933c1.374,0,2.762-0.374,4.003-1.151l38.971-24.37c2.776-1.736,5.974-2.654,9.249-2.654 h90.429c12.842,0,25.445-4.407,35.489-12.409l73.145-58.281C300.817,177.855,303.165,164.286,296.725,153.904z M216.812,174.294c2.034-1.602,4.561-2.236,7.112-1.787c1.536,0.271,2.924,0.913,4.087,1.856l-12.645,10.129 c-1.126-2.111-2.581-4.019-4.282-5.672L216.812,174.294z M281.838,173.64l-73.147,58.282 c-7.377,5.878-16.634,9.116-26.067,9.116H92.194c-6.113,0-12.084,1.714-17.266,4.954l-33.17,20.743L17.799,235.78l56.755-51.969 c8.468-7.753,19.45-12.267,30.924-12.708c8.271-0.32,16.552,1.504,23.932,5.268l11.486,5.861 c6.708,3.422,14.234,5.231,21.763,5.231h32.504c4.278,0,7.757,3.48,7.757,7.758c0,4.105-3.21,7.507-7.308,7.745l-90.45,5.252 c-4.169,0.242-7.352,3.817-7.11,7.985c0.243,4.168,3.798,7.347,7.986,7.109l90.45-5.252 c9.461-0.549,17.317-6.817,20.283-15.321l53.916-43.189c2.036-1.602,4.566-2.237,7.114-1.787 c2.551,0.449,4.708,1.909,6.074,4.111C286.277,165.745,285.402,170.801,281.838,173.64z" />
            <path d="M148.558,131.669c31.886,0,57.827-25.941,57.827-57.827s-25.941-57.827-57.827-57.827S90.731,41.955,90.731,73.842 S116.672,131.669,148.558,131.669z M148.558,31.135c23.549,0,42.707,19.159,42.707,42.707 c0,23.549-19.159,42.707-42.707,42.707c-23.549,0-42.707-19.159-42.707-42.707C105.851,50.293,125.01,31.135,148.558,31.135z" />
            <path d="M147.213,87.744c-2.24,0-4.618-0.546-6.698-1.538c-1.283-0.613-2.778-0.65-4.098-0.105 c-1.344,0.554-2.395,1.656-2.884,3.02l-0.204,0.569c-0.87,2.434,0.204,5.131,2.501,6.274c2.129,1.06,4.734,1.826,7.398,2.182 v2.162c0,2.813,2.289,5.101,5.171,5.101c2.814,0,5.102-2.289,5.102-5.101v-2.759c6.712-2.027,11.018-7.542,11.018-14.188 c0-9.156-6.754-13.085-12.625-15.479c-6.355-2.63-6.832-3.78-6.832-5.234c0-1.914,1.664-3.058,4.453-3.058 c2.043,0,3.883,0.366,5.63,1.121c1.273,0.549,2.682,0.553,3.966,0.009c1.28-0.543,2.297-1.599,2.79-2.901l0.204-0.541 c0.97-2.56-0.228-5.41-2.726-6.487c-1.676-0.723-3.51-1.229-5.46-1.508v-1.908c0-2.813-2.289-5.102-5.102-5.102 c-2.813,0-5.101,2.289-5.101,5.102v2.549c-6.511,1.969-10.53,7.12-10.53,13.561c0,8.421,6.76,12.208,13.342,14.789 c5.579,2.262,6.045,4.063,6.045,5.574C152.572,86.724,149.686,87.744,147.213,87.744z" />
          </svg>
          <span className="text-xs">Donation</span>
        </button>

        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
            activeTab === 'soon' ? 'text-amber-500 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('soon')}
          aria-label="soon tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Soon</span>
        </button>

        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
            activeTab === 'profile' ? 'text-accent dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('profile')}
          aria-label="profile tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a4 4 0 110 8 4 4 0 010-8zm0 10a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
          </svg>
          <span className="text-xs">Profile</span>
        </button>

        <button
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 ${
            activeTab === 'invite' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('invite')}
          aria-label="invite tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C15.64 13.36 17 14.28 17 15.5V19h7v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span className="text-xs">Invite</span>
        </button>
      </nav>
    </div>
  )
}
