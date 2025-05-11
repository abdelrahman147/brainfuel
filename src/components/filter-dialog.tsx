'use client'

import { useState, useEffect } from 'react'
import { useAppState } from '@/lib/state'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { getItems, getAttributes, getCollectionData } from '@/lib/api'
import { toast } from 'sonner'
import backdrops from '../../backdrops.json'
import useSWR from 'swr'
const enc = encodeURIComponent

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper to get the center color for a backdrop name
function getBackdropColor(name: string) {
  const found = backdrops.find(b => b.name.toLowerCase() === name.toLowerCase());
  return found ? found.hex.centerColor : '#ccc';
}

export function FilterDialog({ open, onOpenChange }: FilterDialogProps) {
  const { state, dispatch } = useAppState()
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>(
    { ...state.filters.attributes }
  )
  const [isApplying, setIsApplying] = useState(false)
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false)

  const getPreviewUrl = (traitType: string, value: string) => {
    if (!state.collectionData?.giftName) return ''
    const collection = enc(state.collectionData.giftName)
    const encoded = enc(value)
    if (traitType.toLowerCase() === 'model') {
      return `https://gifts.coffin.meme/${collection}/${encoded}.png`
    }
    if (traitType.toLowerCase() === 'symbol') {
      // Convert the value to lowercase and remove spaces for the filename
      const filename = value.toLowerCase().replace(/\s+/g, '')
      return `/pattern filter/${filename}.png`
    }
    return ''
  }

  // Update selected attributes when filters change
  useEffect(() => {
    setSelectedAttributes({ ...state.filters.attributes })
  }, [state.filters.attributes])

  // SWR for attributes
  const { data: swrAttributes, error: swrAttrError, isLoading: swrAttrLoading } = useSWR(
    open && state.collectionData?.giftName
      ? ['attributes', state.collectionData.giftName]
      : null,
    ([, giftName]) => getAttributes(giftName),
    { revalidateOnFocus: false, dedupingInterval: 1000 * 30 }
  )

  useEffect(() => {
    if (swrAttributes) {
      dispatch({ type: 'SET_ATTRIBUTES_WITH_PERCENTAGES', payload: swrAttributes })
    }
    if (swrAttrError) {
      toast.error(`Failed to load attributes: ${swrAttrError.message}`)
    }
  }, [swrAttributes, swrAttrError, dispatch])

  // SWR for preview filtered count
  const { data: swrFilteredCount, isLoading: swrCountLoading } = useSWR(
    open && state.collectionData?.giftName && Object.keys(selectedAttributes).length > 0
      ? [
          'filtered-count',
          state.collectionData.giftName,
          JSON.stringify(selectedAttributes),
          state.sortOption,
        ]
      : null,
    async ([, giftName, attributes, sort]) => {
      const result = await getItems(giftName, 1, 1, { attributes: JSON.parse(attributes) }, sort)
      return result.totalItems
    },
    { revalidateOnFocus: false, dedupingInterval: 1000 * 10 }
  )

  // Check if a trait value is selected
  const isSelected = (traitType: string, value: string) => {
    return selectedAttributes[traitType]?.includes(value) || false
  }

  // Toggle selection of a trait value
  const toggleAttribute = (traitType: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newState = { ...prev }

      // Initialize the array if it doesn't exist
      if (!newState[traitType]) {
        newState[traitType] = []
      }

      // Toggle the value
      if (newState[traitType].includes(value)) {
        newState[traitType] = newState[traitType].filter(v => v !== value)
        // Clean up empty arrays
        if (newState[traitType].length === 0) {
          delete newState[traitType]
        }
      } else {
        newState[traitType] = [...newState[traitType], value]
      }

      return newState
    })
  }

  // Apply the filters and fetch filtered items using optimized API
  const applyFilters = async () => {
    if (!state.collectionData?.giftName) return

    setIsApplying(true)
    try {
      // Update the filters in state
      dispatch({ type: 'SET_FILTERS', payload: { attributes: selectedAttributes } })

      // Fetch items with the new filters using optimized API
      const result = await getCollectionData(
        state.collectionData.giftName,
        1, // Reset to first page
        state.itemsPerPage,
        { attributes: selectedAttributes },
        state.sortOption,
        false // No need to fetch attributes again
      )

      // Update the collection data with filtered items
      dispatch({
        type: 'SET_COLLECTION_DATA',
        payload: result.collectionData
      })

      // Reset to page 1
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })

      // Close the dialog
      onOpenChange(false)

      // Show a toast with the number of items that matched the filter
      toast.success(`Filter applied: ${result.collectionData.totalItems} items found`)
    } catch (error) {
      console.error('Error applying filters:', error)
      toast.error(`Failed to apply filters: ${(error as Error).message}`)
    } finally {
      setIsApplying(false)
    }
  }

  // Clear all filters using optimized API
  const clearFilters = async () => {
    setSelectedAttributes({})

    if (!state.collectionData?.giftName) return

    setIsApplying(true)
    try {
      // Update the filters in state
      dispatch({ type: 'SET_FILTERS', payload: { attributes: {} } })

      // Fetch items with no filters using optimized API
      const result = await getCollectionData(
        state.collectionData.giftName,
        1,
        state.itemsPerPage,
        { attributes: {} },
        state.sortOption,
        false // No need to fetch attributes again
      )

      // Update the collection data
      dispatch({
        type: 'SET_COLLECTION_DATA',
        payload: result.collectionData
      })

      // Reset to page 1
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })

      // Close the dialog
      onOpenChange(false)

      toast.success('All filters cleared')
    } catch (error) {
      console.error('Error clearing filters:', error)
      toast.error(`Failed to clear filters: ${(error as Error).message}`)
    } finally {
      setIsApplying(false)
    }
  }

  // Calculate total selected filters
  const totalSelectedFilters = Object.values(selectedAttributes).reduce(
    (total, values) => total + values.length,
    0
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-[85vh] overflow-y-auto dark:bg-[#141415] dark:text-[#FFFFFF] dark:border-[#1f1f20]">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold mb-2">Filter Attributes</SheetTitle>
        </SheetHeader>

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={isApplying || Object.keys(selectedAttributes).length === 0}
            className="text-xs dark:border-[#1f1f20] dark:bg-[#1c1c1d] dark:text-[#FFFFFF] dark:hover:bg-[#1f1f20]"
          >
            Clear All
          </Button>
        </div>

        {/* Filtered count info */}
        {swrFilteredCount !== null && totalSelectedFilters > 0 && (
          <div className="mb-4 p-2 bg-muted/20 dark:bg-[#1c1c1d] rounded-md text-sm">
            <span className="font-medium">{swrCountLoading ? 'Calculating...' : `${swrFilteredCount} gifts`}</span>
            <span className="text-muted-foreground dark:text-[#FFFFFF]/70"> match your selected filters</span>
          </div>
        )}

        {swrAttrLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-8 h-8 border-4 border-t-indigo-500 dark:border-t-indigo-400 border-transparent rounded-full animate-spin">
              </div>
            </div>
            <p className="mt-4 text-gray-700 dark:text-[#FFFFFF] text-sm">Loading attributes...</p>
          </div>
        ) : Object.entries(state.attributesWithPercentages).length === 0 ? (
          <p className="text-gray-500 dark:text-[#FFFFFF]/80 text-sm py-4">
            No attributes available. Please select a collection first.
          </p>
        ) : (
          <>
            {Object.entries(state.attributesWithPercentages).map(([traitType, values]) => (
              <div key={traitType} className="mb-6">
                <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-[#FFFFFF]">
                  {traitType}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
                  {Object.entries(values).map(([value, { count, percentage }]) => (
                    <div key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${traitType}-${value}`}
                        checked={isSelected(traitType, value)}
                        onChange={() => toggleAttribute(traitType, value)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 dark:border-[#1f1f20] dark:bg-[#1c1c1d]"
                      />
                      <label
                        htmlFor={`${traitType}-${value}`}
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-[#FFFFFF]/90 flex-grow flex items-center gap-2"
                      >
                        {(['Model','Symbol'].includes(traitType)) && (
                          <img src={getPreviewUrl(traitType, value)} alt={value} className="w-4 h-4 object-contain" />
                        )}
                        {traitType === 'Backdrop' && (
                          <span className="inline-block w-5 h-5 rounded-full border border-gray-300 mr-2" style={{ background: getBackdropColor(value) }} />
                        )}
                        {value} ({percentage}%)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Apply button at the bottom */}
        {totalSelectedFilters > 0 && (
          <div className="pt-4 mt-2 border-t border-border dark:border-[#1f1f20]">
            <Button
              onClick={applyFilters}
              disabled={isApplying || Object.keys(selectedAttributes).length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:from-purple-600 hover:to-indigo-600"
            >
              Apply Filters {swrFilteredCount !== null && !swrCountLoading && `(${swrFilteredCount} gifts)`}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
