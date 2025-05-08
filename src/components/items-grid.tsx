'use client'

import { useEffect, useState, useCallback, useRef, memo } from 'react'
import { useAppState } from '@/lib/state'
import { getItems, getCollectionData } from '@/lib/api'
import { Item } from '@/lib/db'
import { ItemCard } from '@/components/item-card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Memoize the ItemCard component to prevent unnecessary re-renders
const MemoizedItemCard = memo(ItemCard);

export function ItemsGrid() {
  const { state, dispatch } = useAppState()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isFilterChange, setIsFilterChange] = useState(false)
  const prevFilters = useRef(state.filters)
  const prevSortOption = useRef(state.sortOption)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Detect changes in filters
  useEffect(() => {
    // Only track filter changes after initial load
    if (!isInitialLoad) {
      const currentFiltersJson = JSON.stringify(state.filters)
      const prevFiltersJson = JSON.stringify(prevFilters.current)

      if (currentFiltersJson !== prevFiltersJson) {
        setIsFilterChange(true)
        // Update the previous filters reference
        prevFilters.current = state.filters
      }
    }
  }, [state.filters, isInitialLoad])

  // Detect changes in sort option
  useEffect(() => {
    // Only track sort option changes after initial load
    if (!isInitialLoad && state.sortOption !== prevSortOption.current) {
      setIsFilterChange(true)
      prevSortOption.current = state.sortOption
    }
  }, [state.sortOption, isInitialLoad])

  // Memoize the loadItems function to prevent unnecessary re-renders
  const loadItems = useCallback(async () => {
    const giftName = localStorage.getItem('lastGift')
    if (!giftName) return

    const shouldRefresh =
      !state.collectionData ||
      state.collectionData.giftName !== giftName ||
      isInitialLoad

    if (shouldRefresh) {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      try {
        const result = await getCollectionData(
          giftName,
          state.currentPage,
          state.itemsPerPage,
          state.filters,
          state.sortOption,
          true,
          // Use the abort signal for this request
          { signal: abortControllerRef.current.signal }
        )

        dispatch({
          type: 'SET_COLLECTION_DATA',
          payload: result.collectionData,
        })

        // If attributes are returned and there are no existing attributes, set them
        if (Object.keys(result.attributes).length > 0 &&
            Object.keys(state.attributesWithPercentages).length === 0) {
          dispatch({
            type: 'SET_ATTRIBUTES_WITH_PERCENTAGES',
            payload: result.attributes,
          })
        }

        setIsInitialLoad(false)
        setIsFilterChange(false)
      } catch (error) {
        // Only show an error if it's not because of an aborted request
        if ((error as Error).name !== 'AbortError') {
          console.error(`Error loading items for ${giftName}:`, error)
          toast.error(`Failed to load items: ${(error as Error).message}`)
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }
  }, [dispatch, state.currentPage, state.filters, state.itemsPerPage, state.sortOption, isInitialLoad, state.collectionData, state.attributesWithPercentages])

  // This effect handles the initial load and collection changes
  useEffect(() => {
    loadItems()

    // Cleanup function to abort any pending requests when unmounting
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [loadItems])

  // This effect handles filter changes
  useEffect(() => {
    const applyFilters = async () => {
      if (!state.collectionData?.giftName || !isFilterChange) return

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      try {
        const result = await getCollectionData(
          state.collectionData.giftName,
          1, // Reset to first page when filters change
          state.itemsPerPage,
          state.filters,
          state.sortOption,
          false, // Don't need attributes on filter change
          { signal: abortControllerRef.current.signal }
        )

        dispatch({
          type: 'SET_COLLECTION_DATA',
          payload: result.collectionData,
        })

        // Reset to page 1 when filters change
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
        setIsFilterChange(false)
      } catch (error) {
        // Only show an error if it's not because of an aborted request
        if ((error as Error).name !== 'AbortError') {
          console.error('Error applying filters:', error)
          toast.error(`Failed to apply filters: ${(error as Error).message}`)
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }

    if (isFilterChange) {
      applyFilters()
    }

    // Cleanup function to abort any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [isFilterChange, state.collectionData?.giftName, state.filters, state.itemsPerPage, state.sortOption, dispatch])

  // This effect handles page changes
  useEffect(() => {
    const handlePageChange = async () => {
      if (!state.collectionData?.giftName || isInitialLoad || isFilterChange) return

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      try {
        const result = await getCollectionData(
          state.collectionData.giftName,
          state.currentPage,
          state.itemsPerPage,
          state.filters,
          state.sortOption,
          false, // Don't need attributes on page change
          { signal: abortControllerRef.current.signal }
        )

        dispatch({
          type: 'SET_COLLECTION_DATA',
          payload: result.collectionData,
        })
      } catch (error) {
        // Only show an error if it's not because of an aborted request
        if ((error as Error).name !== 'AbortError') {
          console.error(`Error loading page ${state.currentPage}:`, error)
          toast.error(`Failed to load page: ${(error as Error).message}`)
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }

    if (state.currentPage > 1) {
      handlePageChange()
    }

    // Cleanup function to abort any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [state.currentPage, dispatch, state.collectionData?.giftName, state.itemsPerPage, state.filters, state.sortOption, isInitialLoad, isFilterChange])

  // Building the loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {Array.from({ length: state.itemsPerPage }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return renderLoadingSkeleton()
  }

  if (!state.collectionData || state.collectionData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <p className="text-gray-700 dark:text-gray-200 text-base font-semibold">No items found</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {Object.keys(state.filters.attributes).length > 0
            ? "Try adjusting your filter criteria"
            : "Try selecting a different collection"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {state.collectionData.items.map((item) => (
        <MemoizedItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
