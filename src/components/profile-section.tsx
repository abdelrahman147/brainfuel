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
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
        {user?.photo_url && (
          <Image
            src={user.photo_url}
            alt={user.first_name}
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
        )}
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-2xl font-bold text-foreground">{user?.first_name || 'Guest'}</h2>
          {user?.id && (
            <span className="px-3 py-1 rounded-full bg-muted/20 dark:bg-muted/10 text-sm text-muted-foreground">#{user.id}</span>
          )}
        </div>

        <div className="w-full bg-muted/10 dark:bg-muted/5 rounded-xl p-4 flex items-center justify-between mb-2">
          <div>
            <p className="text-muted-foreground text-sm">Balance</p>
            <p className="text-2xl font-bold">0.00</p>
          </div>
          <Button className="text-base px-6 py-3">Withdraw</Button>
        </div>
      </div>
    </div>
  )
}
