'use client'

import { useAppState } from '@/lib/state'
import { PerformanceToggle } from './performance-toggle'
import { DarkModeToggle } from './dark-mode-toggle'
import { getTelegramWebApp } from '@/lib/telegram'
import Image from 'next/image'
import { getCollectionData } from '@/lib/api'
import { toast } from 'sonner'

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { state } = useAppState()
  const tg = getTelegramWebApp()

  // Handle Telegram link click
  const handleTelegramChannelClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

  // Refresh handler
  const handleRefresh = async () => {
    try {
      if(state.collectionData?.giftName){await getCollectionData(state.collectionData.giftName,1,state.itemsPerPage,state.filters,state.sortOption,true)}
      toast.success('Data refreshed!')
    } catch (err) {
      toast.error('Failed to refresh data.')
    }
  }

  return (
    <header className="bg-card border border-border dark:border-accent/20 rounded-xl shadow-lg p-4 mb-6 backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-60 dark:glow-effect transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex items-center justify-center bg-white dark:bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
            <Image
              src="/images/new-gift-logo.jpg"
              alt="Gift Logo"
              width={40}
              height={40}
              className="rounded-md transition-all duration-300"
            />
          </div>
          <a
            href="https://t.me/GiftCatlog"
            onClick={handleTelegramChannelClick}
            className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent dark:glow-text hover:opacity-80 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Gifts Catalog
          </a>
        </div>
        <div className="flex items-center gap-2">
          <PerformanceToggle />
          <DarkModeToggle />
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="ml-1 p-2 rounded-md hover:bg-accent/20 dark:hover:bg-accent/30 transition-colors duration-200"
            aria-label="Refresh"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582M20 20v-5h-.581M19.418 9A7.978 7.978 0 0012 4c-3.042 0-5.824 1.721-7.418 4M4.582 15A7.978 7.978 0 0012 20c3.042 0 5.824-1.721 7.418-4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="flex justify-center mt-4 space-x-4">
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'catalog' ? 'bg-purple-500 text-white' : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
          }`}
          onClick={() => onTabChange('catalog')}
        >
          Catalog
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'donate' ? 'bg-purple-500 text-white' : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
          }`}
          onClick={() => onTabChange('donate')}
        >
          Donate
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'invite' ? 'bg-purple-500 text-white' : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
          }`}
          onClick={() => onTabChange('invite')}
        >
          Invite
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'coming-soon' ? 'bg-purple-500 text-white' : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
          }`}
          onClick={() => onTabChange('coming-soon')}
        >
          Coming Soon
        </button>
      </nav>
    </header>
  )
}
