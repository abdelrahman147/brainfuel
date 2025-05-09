"use client";

export {};

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border dark:border-accent/20 shadow-lg flex justify-around items-center py-2 px-2 md:px-8 animate-fade-in">
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'catalog' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('catalog')}
      >
        <span className="material-icons">grid_view</span>
        <span className="text-xs">Catalog</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 text-muted-foreground opacity-40 cursor-not-allowed`}
        disabled
      >
        <span className="material-icons">volunteer_activism</span>
        <span className="text-xs">Donation</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'coming-soon' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('coming-soon')}
      >
        <span className="material-icons">info</span>
        <span className="text-xs">Soon</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'profile' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('profile')}
      >
        <span className="material-icons">person</span>
        <span className="text-xs">Profile</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 ${activeTab === 'invite' ? 'text-foreground' : 'text-muted-foreground'}`}
        onClick={() => onTabChange('invite')}
      >
        <span className="material-icons">group</span>
        <span className="text-xs">Invite</span>
      </button>
    </nav>
  );
} 