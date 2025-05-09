'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/lib/state'
import { getTelegramWebApp } from '@/lib/telegram'
import { getWallet } from '@/lib/api'
import { toast } from 'sonner'
import duckAnimation from '../../donation page duck.json'
import { LottiePlayer } from './LottiePlayer'

export function DonationSection() {
  const { state } = useAppState()
  const tg = getTelegramWebApp()
  const user = tg?.initDataUnsafe?.user
  const [donationAmount, setDonationAmount] = useState('10')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDonate = async () => {
    if (typeof window === 'undefined') return
    setIsProcessing(true)
    try {
      if (tg && typeof (window as any).Telegram?.WebApp?.openInvoice === 'function') {
        await (window as any).Telegram.WebApp.openInvoice({
          title: 'Donation to GiftCatalog',
          description: 'Support our development',
          payload: JSON.stringify({
            userId: user?.id,
            amount: parseFloat(donationAmount)
          }),
          provider_token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN,
          currency: 'USD',
          prices: [{
            label: 'Donation',
            amount: Math.round(parseFloat(donationAmount) * 100)
          }]
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      if (tg && typeof (window as any).Telegram?.WebApp?.showPopup === 'function') {
        (window as any).Telegram.WebApp.showPopup({ message: 'Payment failed. Please try again.' })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Donation Card */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
            <LottiePlayer
              animationData={duckAnimation}
              style={{ width: '100%', height: '100%' }}
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Support Us
          </h2>
          <p className="text-muted-foreground text-center max-w-lg mb-6">
            Your support helps us maintain and improve the Gift Catalog platform. Every contribution makes a difference!
          </p>
          <div className="w-full max-w-xs space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-border/30 bg-background/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                step="1"
              />
              <span className="text-foreground font-medium">USD</span>
            </div>
            <button
              onClick={handleDonate}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span>Donate Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
