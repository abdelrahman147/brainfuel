'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/lib/state'
import { getTelegramWebApp } from '@/lib/telegram'
import { getWallet } from '@/lib/api'
import { toast } from 'sonner'

export function DonationSection() {
  const { state } = useAppState()
  const tg = getTelegramWebApp()
  const [tonWalletAddress, setTonWalletAddress] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadWalletAddress = async () => {
      setIsLoading(true)
      try {
        const { address } = await getWallet()
        setTonWalletAddress(address)

        // Removed Telegram MainButton setup for Mini App compatibility
      } catch (error) {
        console.error('Failed to load wallet address:', error)
        toast.error('Failed to load wallet address')
      } finally {
        setIsLoading(false)
      }
    }

    loadWalletAddress()

    return () => {
      // Removed Telegram MainButton cleanup
    }
  }, [tg.MainButton])

  const handleCopyWallet = async () => {
    if (!tonWalletAddress) return

    try {
      await navigator.clipboard.writeText(tonWalletAddress)
      toast.success('Wallet address copied to clipboard!')
      // Removed Telegram MainButton feedback
    } catch (error) {
      toast.error('Failed to copy wallet address')
    }
  }

  // Handle Telegram link click
  const handleTelegramLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const url = e.currentTarget.href

    // Use Telegram's openLink method if available to prevent mini app from closing
    if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
      (window as any).Telegram.WebApp.openLink(url)
    } else {
      // Fallback for non-Telegram environments
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Support section */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60">
        <h2 className="text-lg font-semibold text-foreground dark:text-foreground mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-red-500 animate-heartbeat"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Support the Project
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Your donations help keep this project running! Send TON to the wallet address below.
        </p>
        <div className="relative mb-4">
          <input
            type="text"
            readOnly
            value={isLoading ? 'Loading...' : tonWalletAddress}
            className="w-full bg-muted/20 dark:bg-muted/10 p-3 rounded-lg text-sm text-foreground dark:text-muted-foreground border border-border dark:border-border/30 focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Button
            size="sm"
            onClick={handleCopyWallet}
            disabled={isLoading || !tonWalletAddress}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-md text-xs hover:bg-accent/80 transition-all duration-200"
          >
            Copy
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Please verify the wallet address before sending any funds.
        </p>
      </div>

      {/* Follow and Contact section */}
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60">
        <div className="flex flex-col items-center justify-center space-y-3">
          <a
            href="https://t.me/yousefmsm1"
            onClick={handleTelegramLinkClick}
            className="flex items-center justify-center w-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors rounded-lg py-2.5 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v5h-2zm0 7h2v2h-2z" />
            </svg>
            Follow the Channel
          </a>

          <a
            href="https://t.me/yousefmsm1"
            onClick={handleTelegramLinkClick}
            className="flex items-center justify-center w-full bg-muted/20 dark:bg-muted/10 text-foreground dark:text-foreground hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors rounded-lg py-2.5 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            </svg>
            Contact Developer
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center border-t border-border/30 dark:border-border/10">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>Built with</span>
          <span className="inline-block mx-2">
            <svg
              className="w-4 h-4 text-red-500 animate-heartbeat"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.8))',
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <span>by JustWaitingTeam</span>
        </div>
      </div>
    </div>
  )
}
