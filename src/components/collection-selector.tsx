'use client'

import { useEffect, useState, useRef } from 'react'
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
import { useCollectionData } from '@/hooks/use-collection-data'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// Helper to get the image URL for a collection
function getCollectionImage(name: string, ext: 'jpg' | 'png' = 'jpg') {
  // Normalize: lowercase, remove spaces and special characters
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `/Gift Collection Images/${safeName}.${ext}`;
}

function getImageFallbacks(name: string, unique?: string) {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const suffix = unique ? `?t=${unique}` : '';
  return [
    `/Gift Collection Images/${safeName}.jpg${suffix}`,
    `/Gift Collection Images/${safeName}.png${suffix}`,
    `/images/new-gift-logo.jpg${suffix}`,
  ];
}

export function CollectionSelector() {
  const { state, dispatch } = useAppState()
  const [selectedGift, setSelectedGift] = useState<string | undefined>(undefined)
  const [showMiniLoading, setShowMiniLoading] = useState(false)
  const [miniLottieData, setMiniLottieData] = useState<any>(null)
  const [overlayKey, setOverlayKey] = useState('')
  const [assetStatus, setAssetStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use SWR for collection data
  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
    mutate: mutateCollectionData,
  } = useCollectionData({
    giftName: selectedGift,
    page: 1,
    limit: state.itemsPerPage,
    filters: { attributes: {} },
    sort: state.sortOption,
    includeAttributes: true,
    enabled: Boolean(selectedGift),
  })

  // Update state when SWR data changes
  useEffect(() => {
    if (swrData) {
      dispatch({ type: 'SET_COLLECTION_DATA', payload: swrData.collectionData })
      if (Object.keys(swrData.attributes).length > 0) {
        dispatch({ type: 'SET_ATTRIBUTES_WITH_PERCENTAGES', payload: swrData.attributes })
      }
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
    }
  }, [swrData, dispatch])

  // Handle errors
  useEffect(() => {
    if (swrError) {
      toast.error(`Failed to load collection: ${swrError.message}`)
    }
  }, [swrError])

  // Show overlay and force asset reload on collection change
  const handleCollectionChange = (value: string) => {
    const newKey = value + '-' + Date.now() + '-' + Math.random().toString(36).slice(2)
    localStorage.setItem('lastGift', value)
    setOverlayKey(newKey)
    setShowMiniLoading(true)
    setAssetStatus('loading')
    setSelectedGift(value)
  }

  // Load Lottie or image when overlayKey changes
  useEffect(() => {
    if (!overlayKey || !selectedGift) return;
    setMiniLottieData(null)
    setAssetStatus('loading')
    if (!state.performanceMode) {
      const lottieUrl = `/${selectedGift.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.json`
      fetch(lottieUrl)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setMiniLottieData(data)
        })
        .catch(() => setMiniLottieData(null))
    }
    // Hide overlay after 2s max
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current)
    overlayTimeoutRef.current = setTimeout(() => {
      setShowMiniLoading(false)
      setAssetStatus('failed')
    }, 2000)
    return () => {
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current)
    }
  }, [overlayKey, selectedGift, state.performanceMode])

  // Hide overlay when asset loads
  const handleAssetLoaded = () => {
    setShowMiniLoading(false)
    setAssetStatus('loaded')
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current)
  }
  const handleAssetFailed = () => {
    setShowMiniLoading(false)
    setAssetStatus('failed')
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current)
  }

  return (
    <div className="relative">
      {showMiniLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 bg-opacity-90 animate-fade-in">
          {/* Debug Panel */}
          <div className="mb-2 p-2 rounded bg-white/80 dark:bg-black/60 text-xs text-gray-800 dark:text-gray-100 shadow">
            <div><b>selectedGift:</b> {selectedGift}</div>
            <div><b>overlayKey:</b> {overlayKey}</div>
            <div><b>assetStatus:</b> {assetStatus}</div>
            {selectedGift && <div><b>Image URL:</b> <span style={{wordBreak:'break-all'}}>{getImageFallbacks(selectedGift, overlayKey)[0]}</span></div>}
          </div>
          {/* Spinner or Asset */}
          {assetStatus === 'loading' && (
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
          )}
          {miniLottieData ? (
            <Lottie animationData={miniLottieData} loop autoplay style={{ width: 96, height: 96 }} key={overlayKey} onDOMLoaded={handleAssetLoaded} />
          ) : (
            <CollectionImageWithFallback name={selectedGift || ''} unique={overlayKey} key={overlayKey} onLoad={handleAssetLoaded} onError={handleAssetFailed} />
          )}
          {/* Status Message */}
          {assetStatus === 'loaded' && <div className="text-green-600 dark:text-green-400 font-bold mt-2">Loaded!</div>}
          {assetStatus === 'failed' && <div className="text-red-600 dark:text-red-400 font-bold mt-2">Failed to load</div>}
          <div className="text-xs font-semibold text-foreground dark:text-foreground mt-2">Loading {selectedGift || 'Collection'}...</div>
        </div>
      )}
      <Select onValueChange={handleCollectionChange} disabled={swrLoading} defaultValue={localStorage.getItem('lastGift') || undefined}>
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
                className="text-xs flex items-center"
              >
                <img
                  src={getCollectionImage(gift.name, 'jpg')}
                  alt={gift.name}
                  className="w-7 h-7 object-contain mr-2 align-middle"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', display: 'inline-block', verticalAlign: 'middle' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src.endsWith('.jpg')) {
                      img.src = getCollectionImage(gift.name, 'png');
                    } else {
                      img.src = '/images/new-gift-logo.jpg';
                    }
                  }}
                />
                <span className="align-middle">{gift.name} ({gift.total} items)</span>
              </SelectItem>
            ))}
            {state.gifts.length === 0 && (
              <SelectItem value="loading" disabled>
                {swrLoading ? 'Loading collections...' : 'No collections available'}
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

function CollectionImageWithFallback({ name, unique, onLoad, onError }: { name: string, unique?: string, onLoad?: () => void, onError?: () => void }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const fallbacks = getImageFallbacks(name, unique);
  useEffect(() => { setSrcIndex(0); }, [name, unique]);
  return (
    <img
      src={fallbacks[srcIndex]}
      alt={name}
      key={fallbacks[srcIndex]}
      className="w-24 h-24 object-contain mb-2 rounded-lg shadow-lg"
      onError={() => {
        if (srcIndex < fallbacks.length - 1) setSrcIndex(srcIndex + 1);
        else if (onError) onError();
      }}
      onLoad={onLoad}
    />
  );
}
