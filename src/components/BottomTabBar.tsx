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
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'catalog' ? 'border-b-2 border-purple-600 dark:border-purple-300' : ''}`}
        onClick={() => onTabChange('catalog')}
      >
        <Grid className={`w-5 h-5 mb-1 ${activeTab === 'catalog' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`} />
        <span className={`text-xs font-semibold ${activeTab === 'catalog' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>{t.header.giftsCatalog || 'Catalog'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 cursor-not-allowed`}
        disabled
      >
        <Heart className="w-5 h-5 mb-1" />
        <span className="text-xs font-semibold">{t.donation?.support || 'Donation'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'coming-soon' ? 'border-b-2 border-purple-600 dark:border-purple-300' : ''}`}
        onClick={() => onTabChange('coming-soon')}
      >
        <Info className={`w-5 h-5 mb-1 ${activeTab === 'coming-soon' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`} />
        <span className={`text-xs font-semibold ${activeTab === 'coming-soon' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>{t.profile?.soon || 'Soon'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'profile' ? 'border-b-2 border-purple-600 dark:border-purple-300' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User className={`w-5 h-5 mb-1 ${activeTab === 'profile' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`} />
        <span className={`text-xs font-semibold ${activeTab === 'profile' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>{t.profileLabel || 'Profile'}</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'invite' ? 'border-b-2 border-purple-600 dark:border-purple-300' : ''}`}
        onClick={() => onTabChange('invite')}
      >
        <Users className={`w-5 h-5 mb-1 ${activeTab === 'invite' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`} />
        <span className={`text-xs font-semibold ${activeTab === 'invite' ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>{t.invite?.inviteFriends || 'Invite'}</span>
      </button>
    </nav>
  );
} 