import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollToTopContextType {
  position: 'default' | 'support' | 'submit';
  setPosition: (position: 'default' | 'support' | 'submit') => void;
}

const ScrollToTopContext = createContext<ScrollToTopContextType | undefined>(undefined);

export const useScrollToTop = () => {
  const context = useContext(ScrollToTopContext);
  if (context === undefined) {
    throw new Error('useScrollToTop must be used within a ScrollToTopProvider');
  }
  return context;
};

interface ScrollToTopProviderProps {
  children: ReactNode;
}

export const ScrollToTopProvider: React.FC<ScrollToTopProviderProps> = ({ children }) => {
  const [position, setPosition] = useState<'default' | 'support' | 'submit'>('default');

  return (
    <ScrollToTopContext.Provider value={{ position, setPosition }}>
      {children}
    </ScrollToTopContext.Provider>
  );
};
