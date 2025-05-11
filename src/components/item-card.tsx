'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppState } from '@/lib/state'
import { Card, CardFooter } from '@/components/ui/card'
import type { Item } from '@/lib/db'
import { ItemModal } from '@/components/item-modal'

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const { state } = useAppState()
  const [showModal, setShowModal] = useState(false)
  const lottieAnimRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Fix hydration by only rendering client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!isClient) return

    const options = {
      root: null,
      rootMargin: '100px', // Load when item gets within 100px of viewport
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [isClient])

  // Helper function to format collection name for URL
  const formatCollectionName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, '')
  }

  // Extract the ID number from the item name
  const extractItemNumber = (name: string): string => {
    const itemNameParts = name.split('#')
    if (itemNameParts.length > 1) {
      return itemNameParts[1].trim()
    }
    return String(item.id)
  }

  // Use current collection name from state
  const collectionName = state.collectionData?.giftName ? formatCollectionName(state.collectionData.giftName) : formatCollectionName(item.name)
  const itemNumber = extractItemNumber(item.name)
  const lottieUrl = `https://nft.fragment.com/gift/${collectionName}-${itemNumber}.lottie.json`

  // Load content only when item is visible
  const loadContent = useCallback(() => {
    if (!isVisible || isLoaded) return

    setIsLoaded(true)

    const loadImage = () => {
      if (containerRef.current) {
        const img = new Image()
        img.src = `https://nft.fragment.com/gift/${collectionName}-${itemNumber}.webp`
        img.className = 'w-full h-full object-cover rounded-none transition-all duration-300'
        img.alt = item.name
        img.loading = 'lazy'
        img.style.display = 'block'

        img.onload = () => {
          img.classList.add('loaded')
          containerRef.current?.classList.add('image-loaded')
        }

        img.onerror = () => {
          img.src = `https://nft.fragment.com/gift/${collectionName}-${itemNumber}.jpg`
          img.onerror = () => {
            img.src = `https://nft.fragment.com/gift/${collectionName}-${itemNumber}.png`
          }
        }

        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(img)
      }
    }

    const loadLottie = async () => {
      loadImage()
      if (containerRef.current && item.lottie && typeof window !== 'undefined') {
        try {
          import('lottie-web').then(module => {
            const lottie = module.default
            if (containerRef.current) {
              containerRef.current.innerHTML = ''
              // Try to fetch the Lottie file first
              fetch(lottieUrl)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                  if (data && containerRef.current) {
                    lottieAnimRef.current = lottie.loadAnimation({
                      container: containerRef.current as Element,
                      renderer: 'svg',
                      loop: true,
                      autoplay: true,
                      animationData: data
                    })
                    containerRef.current.classList.add('lottie-loaded')
                  } // else, fallback image is already shown
                })
                .catch(() => {/* fallback image is already shown */})
            }
          }).catch(error => {
            console.error('Error importing lottie-web:', error)
          })
        } catch (error) {
          console.error('Error loading lottie animation:', error)
        }
      }
    }

    loadImage()
    if (!state.performanceMode) {
      loadLottie()
    }
  }, [isVisible, isLoaded, item, state.performanceMode, collectionName, itemNumber])

  // Cleanup lottie animation on unmount
  useEffect(() => {
    return () => {
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy()
        lottieAnimRef.current = null
      }
    }
  }, [])

  // Load content when visible
  useEffect(() => {
    if (isVisible && !isLoaded) {
      loadContent()
    }
  }, [isVisible, isLoaded, loadContent])

  // Update content when performance mode changes
  useEffect(() => {
    if (isVisible && isLoaded) {
      // Cleanup existing content
      if (lottieAnimRef.current) {
        lottieAnimRef.current.destroy()
        lottieAnimRef.current = null
      }

      // Reset the loaded state so it will reload content
      setIsLoaded(false)
    }
  }, [state.performanceMode, isVisible])

  // Show placeholder during server-side rendering to prevent hydration mismatch
  if (!isClient) {
    return (
      <Card className="bg-card border border-border dark:border-border/20 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer animate-fade-in-up">
        <div className="aspect-square relative">
          <div className="w-full h-full bg-muted dark:bg-muted/20"></div>
        </div>
        <CardFooter className="p-4">
          <h3 className="font-medium text-foreground dark:text-foreground truncate">{item.name}</h3>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <Card
        ref={cardRef}
        className="bg-card border border-border dark:border-border/20 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer animate-fade-in-up"
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-square relative">
          <div
            ref={containerRef}
            id={`item-${item.id}`}
            className="w-full h-full bg-muted dark:bg-muted/20 overflow-hidden transition-all duration-300"
          ></div>

          <style jsx>{`
            .image-loaded {
              background-color: transparent !important;
            }

            .image-loaded img.loaded {
              animation: fadeIn 0.5s ease-in-out;
            }

            @keyframes fadeIn {
              from { opacity: 0.5; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
        <CardFooter className="p-4">
          <h3 className="font-medium text-foreground dark:text-foreground truncate">{item.name}</h3>
        </CardFooter>
      </Card>

      {showModal && (
        <ItemModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
