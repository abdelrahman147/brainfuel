import { useAppState } from '@/lib/state'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ProfileSection() {
  const { state, dispatch } = useAppState()
  const user = state.telegramUser

  // Language state (persisted in localStorage)
  const [language, setLanguage] = useState('en')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('language')
      if (lang) setLanguage(lang)
    }
  }, [])
  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'ru' : 'en'
    setLanguage(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang)
    }
  }

  // Dark mode toggle
  const handleDarkModeToggle = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode })
  }

  // Performance mode toggle
  const handlePerformanceToggle = () => {
    dispatch({ type: 'SET_PERFORMANCE_MODE', payload: !state.performanceMode })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-card border border-border dark:border-border/30 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-400 flex items-center justify-center shadow-lg">
            <Image
              src={user?.photo_url || '/images/default-avatar.png'}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white dark:border-gray-900"
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">{user?.first_name || 'Anonymous'}</h2>
        <p className="text-muted-foreground text-sm mb-4">@{user?.username || 'username'}</p>
        <div className="flex gap-4 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-purple-500">0</span>
            <span className="text-xs text-muted-foreground">Points</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-indigo-500">0</span>
            <span className="text-xs text-muted-foreground">TON Earned</span>
          </div>
        </div>
        <div className="flex gap-3 w-full justify-center mb-4">
          <Button variant="outline" onClick={handleDarkModeToggle} className="rounded-lg px-4 py-2">
            {state.darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button variant="outline" onClick={handlePerformanceToggle} className="rounded-lg px-4 py-2">
            {state.performanceMode ? 'Performance On' : 'Performance Off'}
          </Button>
        </div>
        <div className="flex gap-3 w-full justify-center">
          <Button variant="outline" onClick={handleLanguageToggle} className="rounded-lg px-4 py-2">
            {language === 'en' ? 'English' : 'Русский'}
          </Button>
        </div>
      </div>
    </div>
  )
}
