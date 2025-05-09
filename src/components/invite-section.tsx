'use client'

import { useState, useEffect } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'
import duckAnimation from '../../duck_invitation.json'
import { LottiePlayer } from './LottiePlayer'

const BOT_LINK = 'https://t.me/GiftCatalog_bot/GiftCatalog03';

export function InviteSection() {
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user;
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      setReferralLink(`${BOT_LINK}?startapp=ref_${user.id}`);
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center mt-4 mb-2">
        <div className="w-32 h-32">
          <LottiePlayer
            animationData={duckAnimation}
            style={{ width: '100%', height: '100%' }}
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">Invite Friends</h2>
        <p className="text-muted-foreground text-center max-w-lg mb-4">
          Invite friends and earn Points rewards and to convert them to TON from their activity in (Disclosed).
        </p>
      </div>
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 flex flex-col items-center">
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
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 flex flex-col items-center">
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
  );
} 