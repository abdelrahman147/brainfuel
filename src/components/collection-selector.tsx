'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppState } from '@/lib/state'
import { listExports, getCollectionData } from '@/lib/api'
import { toast } from 'sonner'

export function CollectionSelector() {
  const { state, dispatch } = useAppState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadGifts = async () => {
      if (state.gifts.length === 0) {
        setIsLoading(true)
        try {
          const exports = await listExports()
          dispatch({ type: 'SET_GIFTS', payload: exports.db })

          // Select the first gift if available
          if (exports.db.length > 0) {
            const lastGift = localStorage.getItem('lastGift')
            const giftToLoad = lastGift && exports.db.some(g => g.name === lastGift)
              ? lastGift
              : exports.db[0].name

            // Auto-load the collection
            localStorage.setItem('lastGift', giftToLoad)
            await loadCollection(giftToLoad)
          }
        } catch (error) {
          console.error('Failed to load collections:', error)
          toast.error('Failed to load collections')
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadGifts()
  }, [dispatch, state.gifts.length])

  // Function to load collection data
  const loadCollection = async (giftName: string) => {
    setIsLoading(true)
    try {
      // Clear filters when changing collections
      dispatch({ type: 'SET_FILTERS', payload: { attributes: {} } })

      // Use optimized endpoint to get items, attributes, and stats in one call
      const result = await getCollectionData(
        giftName,
        1, // Start with first page
        state.itemsPerPage,
        { attributes: {} }, // Empty filters
        state.sortOption,
        true // Include attributes
      )

      // Update state with the fetched data
      dispatch({
        type: 'SET_COLLECTION_DATA',
        payload: result.collectionData,
      })

      // Set current page to 1
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })

      // Update attributes with percentages
      if (Object.keys(result.attributes).length > 0) {
        dispatch({
          type: 'SET_ATTRIBUTES_WITH_PERCENTAGES',
          payload: result.attributes,
        })
      }

      toast.success(`Loaded ${giftName} collection`)
    } catch (error) {
      console.error(`Failed to load ${giftName}:`, error)
      toast.error(`Failed to load collection: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCollectionChange = async (value: string) => {
    localStorage.setItem('lastGift', value)
    await loadCollection(value)
  }

  return (
    <Select onValueChange={handleCollectionChange} disabled={isLoading} defaultValue={localStorage.getItem('lastGift') || undefined}>
      <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-xs text-gray-700 shadow-sm">
        <SelectValue placeholder="Select Collection" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Collections</SelectLabel>
          {state.gifts.map((gift) => (
            <SelectItem
              key={gift.name}
              value={gift.name}
              className="text-xs"
            >
              {gift.name} ({gift.total} items)
            </SelectItem>
          ))}
          {state.gifts.length === 0 && (
            <SelectItem value="loading" disabled>
              {isLoading ? 'Loading collections...' : 'No collections available'}
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
