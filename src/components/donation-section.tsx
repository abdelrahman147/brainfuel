'use client'

import { useState } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'
import { LottiePlayer } from './LottiePlayer'
import duckAnimation from '../../donation page duck.json'

const TON_WALLET = process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS || process.env.TON_WALLET_ADDRESS || '';

export function DonationSection() {
  const [copied, setCopied] = useState(false)
  const tg = getTelegramWebApp()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TON_WALLET)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      if (tg && typeof (window as any).Telegram?.WebApp?.showPopup === 'function') {
        (window as any).Telegram.WebApp.showPopup({ message: 'Wallet address copied!' })
      }
    } catch {
      setCopied(false)
    }
  }

  const handleChannel = () => {
    const url = 'https://t.me/GiftCatlog'
    if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
      (window as any).Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  const handleContact = () => {
    const url = 'https://t.me/yousefmsm1'
    if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
      (window as any).Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in space-y-6">
      <div className="w-32 h-32 mb-2">
        <LottiePlayer
          animationData={duckAnimation}
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      </div>
      <div className="bg-white dark:bg-card border border-border rounded-xl shadow-md p-6 w-full max-w-md flex flex-col items-center">
        <div className="flex items-center mb-2">
          <span className="mr-2 text-xl animate-pump-heart" style={{ display: 'inline-block' }}>
            <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <span className="font-bold text-lg">Support the Project</span>
        </div>
        <p className="text-muted-foreground text-center mb-4">
          Your donations help keep this project running! Send TON to the wallet address below.
        </p>
        <div className="flex w-full items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 mb-2">
          <input
            type="text"
            value={TON_WALLET}
            readOnly
            className="flex-1 bg-transparent text-sm text-foreground border-none outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">Please verify the wallet address before sending any funds.</p>
      </div>
      <div className="w-full max-w-md flex flex-col gap-3 mt-2 bg-white dark:bg-card border border-border rounded-xl shadow-md p-4">
        <button
          onClick={handleChannel}
          className="w-full flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/80 transition-colors rounded-lg py-3 text-sm font-medium"
        >
          <span className="mr-2">🔗</span> Follow the Channel
        </button>
        <button
          onClick={handleContact}
          className="w-full flex items-center justify-center bg-muted/20 dark:bg-muted/10 text-foreground dark:text-foreground hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors rounded-lg py-3 text-sm font-medium"
        >
          <span className="mr-2">💬</span> Contact Developer
        </button>
      </div>
      <style jsx global>{`
        @keyframes pump-heart {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.15); }
          20% { transform: scale(0.95); }
          30% { transform: scale(1.1); }
          50% { transform: scale(0.97); }
          60% { transform: scale(1.05); }
          70% { transform: scale(0.98); }
          80% { transform: scale(1.02); }
        }
        .animate-pump-heart {
          animation: pump-heart 1.2s infinite;
        }
      `}</style>
    </div>
  )
}
