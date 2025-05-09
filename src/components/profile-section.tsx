import { useAppState } from '@/lib/state'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useLanguage } from './app-provider'
import { translations } from '@/lib/translations'

export function ProfileSection() {
  const { state, dispatch } = useAppState()
  const user = state.telegramUser
  const { language, setLanguage } = useLanguage()
  const lang: 'en' | 'ru' = language === 'ru' ? 'ru' : 'en'
  const t = translations[lang].profile

  // Dark mode toggle
  const handleDarkModeToggle = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode })
  }

  // Performance mode toggle
  const handlePerformanceToggle = () => {
    dispatch({ type: 'SET_PERFORMANCE_MODE', payload: !state.performanceMode })
  }

  // Language toggle
  const handleLanguageToggle = () => {
    setLanguage(lang === 'en' ? 'ru' : 'en')
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
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {t.points}
              <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-purple-400 text-white text-[10px] rounded-full animate-pulse font-bold shadow-md">{t.soon}</span>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-indigo-500">0</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {t.tonEarned}
              <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-purple-400 text-white text-[10px] rounded-full animate-pulse font-bold shadow-md">{t.soon}</span>
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full justify-center mb-4">
          <Button variant="outline" onClick={handleDarkModeToggle} className="rounded-lg px-4 py-2">
            {state.darkMode ? t.lightMode : t.darkMode}
          </Button>
          <Button variant="outline" onClick={handlePerformanceToggle} className="rounded-lg px-4 py-2">
            {state.performanceMode ? t.performanceOn : t.performanceOff}
          </Button>
        </div>
        <div className="flex gap-3 w-full justify-center">
          <Button variant="outline" onClick={handleLanguageToggle} className="rounded-lg px-4 py-2">
            {lang === 'en' ? t.english : t.russian}
          </Button>
        </div>
      </div>
    </div>
  )
}
