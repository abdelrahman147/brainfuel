'use client'

import { useReducer, useEffect, useState } from 'react'
import {
  AppStateContext,
  appReducer,
  initialState,
  loadPersistedState
} from '@/lib/state'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  // This will store whether we're on the client side or not
  const [hydrated, setHydrated] = useState(false)

  // Initialize with the base initialState only
  const [state, dispatch] = useReducer(
    appReducer,
    initialState
  )

  // Handle client-side initialization and load persisted state after hydration
  useEffect(() => {
    // This runs on the client only, once
    const persistedState = loadPersistedState()

    // Apply each persisted state property individually to avoid race conditions
    if (persistedState.performanceMode !== undefined) {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: persistedState.performanceMode })
    }

    if (persistedState.darkMode !== undefined) {
      dispatch({ type: 'SET_DARK_MODE', payload: persistedState.darkMode })
    }

    if (persistedState.filters) {
      dispatch({ type: 'SET_FILTERS', payload: persistedState.filters })
    }

    if (persistedState.itemsPerPage) {
      dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: persistedState.itemsPerPage })
    }

    // Mark as hydrated
    setHydrated(true)
  }, [])

  // This ensures that the UI doesn't flicker before the client-side state is loaded
  if (!hydrated) {
    // Return a placeholder or null while we wait for hydration
    return null
  }

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}
