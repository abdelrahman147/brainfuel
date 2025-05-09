'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { CatalogSection } from '@/components/catalog-section'
import { DonationSection } from '@/components/donation-section'
import { Pagination } from '@/components/pagination'
import { getTelegramWebApp } from '@/lib/telegram'
import { ProfileSection } from '@/components/profile-section'
import { InviteSection } from '@/components/invite-section'
import { ComingSoonSection } from '@/components/coming-soon-section'

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
