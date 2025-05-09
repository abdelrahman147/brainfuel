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
import { BottomTabBar } from '@/components/BottomTabBar'

export default function Home() {
  const [activeTab, setActiveTab] = useState('catalog')

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
            activeTab === 'invite' ? 'text-accent dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('invite')}
          aria-label="invite tab"
        >
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17 20h-2v-2a4 4 0 00-8 0v2H5a2 2 0 01-2-2v-2a6 6 0 0112 0v2a2 2 0 01-2 2zM7 8a4 4 0 118 0 4 4 0 01-8 0z" />
          </svg>
          <span className="text-xs">Invite</span>
        </button>
      </nav>
    </div>
  )
}
