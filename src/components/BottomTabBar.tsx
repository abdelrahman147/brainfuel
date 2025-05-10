"use client";

export {};

import { useLanguage } from './app-provider';
import { translations } from '@/lib/translations';
import { Grid, Heart, Info, User, Users } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const { language } = useLanguage();
  const lang: 'en' | 'ru' = language === 'ru' ? 'ru' : 'en';
  const t = translations[lang];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border dark:border-accent/20 shadow-lg flex justify-around items-center py-2 px-2 md:px-8 animate-fade-in">
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'catalog' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('catalog')}
      >
        <Grid className="w-5 h-5" />
        <span className="text-xs">{t.header.giftsCatalog || 'Catalog'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 text-muted-foreground opacity-40 cursor-not-allowed`}
        disabled
      >
        <Heart className="w-5 h-5" />
        <span className="text-xs">{t.donation?.support || 'Donation'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'coming-soon' ? 'text-amber-500 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}
        onClick={() => onTabChange('coming-soon')}
      >
        <Info className="w-5 h-5 animate-pulse text-amber-500 dark:text-purple-400 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full p-1 shadow-md" />
        <span className="text-xs font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent animate-pulse">{t.profile?.soon || 'Soon'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'profile' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('profile')}
      >
        <User className="w-5 h-5" />
        <span className="text-xs">{t.profileLabel || 'Profile'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'invite' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('invite')}
      >
        <Users className="w-5 h-5" />
        <span className="text-xs">{t.invite?.inviteFriends || 'Invite'}</span>
      </button>
    </nav>
  );
} 