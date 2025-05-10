'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppState } from '@/lib/state'
import { getTelegramWebApp } from '@/lib/telegram'
import type { Item } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { X, Send } from 'lucide-react'
import { useTheme } from 'next-themes'

interface ItemModalProps {
  item: Item
  onClose: () => void
}

export function ItemModal({ item, onClose }: ItemModalProps) {
  const { state } = useAppState()
  const { theme } = useTheme()
  const tg = getTelegramWebApp()
  const [isClient, setIsClient] = useState(false)
  const [closing, setClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const isDarkMode = theme === 'dark'

  // Format gift name and extract item number
  const formatGiftName = (name: string): string => {
    const parts = name.split('#')
    return parts[0].trim().toLowerCase().replace(/\s+/g, '')
  }

  const extractItemNumber = (name: string): string => {
    const parts = name.split('#')
    if (parts.length > 1) {
      return parts[1].trim()
    }
    return String(item.id)
  }

  const giftName = formatGiftName(item.name)
  const itemNumber = extractItemNumber(item.name)
  const imageUrl = `https://nft.fragment.com/gift/${giftName}-${itemNumber}.webp`

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeWithAnimation()
    }
  }

  // Creative close with animation
  const closeWithAnimation = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
    }, 300) // Match this with CSS transition duration
  }

  useEffect(() => {
    setIsClient(true)
    const scrollY = window.scrollY
    document.body.classList.add('modal-open')
    document.body.style.top = `-${scrollY}px`

    // Show Telegram back button
    tg.BackButton.show()
    tg.BackButton.onClick(closeWithAnimation)

    // Add escape key listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWithAnimation()
      }
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.top = ''
      window.scrollTo(0, scrollY)
      tg.BackButton.hide()
      tg.BackButton.offClick(closeWithAnimation)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [tg.BackButton])

  if (!isClient) return null

  const telegramLink = `https://t.me/nft/${giftName}-${itemNumber}`

  // Dark mode colors
  const colors = {
    backdrop: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.75)',
    background: isDarkMode ? '#1c1c1e' : 'white',
    cardBg: isDarkMode ? '#2c2c2e' : 'white',
    border: isDarkMode ? '#3c3c3e' : '#eee',
    text: isDarkMode ? '#f2f2f7' : '#333',
    textSecondary: isDarkMode ? '#d1d1d6' : '#666',
    headerBg: isDarkMode ? '#2c2c2e' : 'white',
    sectionBg: isDarkMode ? '#1c1c1e' : '#f8f9fa',
    attributeBg: isDarkMode ? '#2c2c2e' : '#f8f9fa',
    shadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.2)',
    buttonBg: isDarkMode ? '#0088cc' : '#0088cc',
    buttonShadow: isDarkMode ? 'rgba(0,136,204,0.4)' : 'rgba(0,136,204,0.3)',
    closeButtonBg: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border dark:border-border/30 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in relative">
        {/* Close button */}
        <button
          onClick={closeWithAnimation}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            backgroundColor: colors.closeButtonBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            WebkitTapHighlightColor: 'transparent'
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(0,0,0,0.25)'
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.backgroundColor = colors.closeButtonBg
          }}
        >
          <X size={18} color="white" />
        </button>

        {/* Header (fixed) */}
        <div style={{
          padding: '16px',
          paddingRight: '44px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.headerBg,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text
          }}>{item.name}</h2>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          background: colors.background
        }}>
          {/* Image */}
          <div style={{
            padding: '16px',
            backgroundColor: colors.sectionBg
          }}>
            <div style={{
              aspectRatio: '1/1',
              backgroundColor: colors.cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
              border: isDarkMode ? `1px solid ${colors.border}` : 'none'
            }}>
              <img
                src={imageUrl}
                alt={item.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src.endsWith('.webp')) {
                    target.src = `https://nft.fragment.com/gift/${giftName}-${itemNumber}.jpg`
                  } else if (target.src.endsWith('.jpg')) {
                    target.src = `https://nft.fragment.com/gift/${giftName}-${itemNumber}.png`
                  }
                }}
              />
            </div>
          </div>

          {/* Attributes */}
          <div style={{
            padding: '16px',
            backgroundColor: colors.background
          }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{
                display: 'flex',
                padding: '12px',
                backgroundColor: colors.attributeBg,
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{
                  width: '40%',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: colors.text
                }}>ID</div>
                <div style={{
                  width: '60%',
                  fontSize: '14px',
                  color: colors.textSecondary
                }}>{item.id}</div>
              </div>

              {item.attributes?.map((attr, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '12px',
                    borderBottom: index < (item.attributes?.length || 0) - 1 ? `1px solid ${colors.border}` : 'none'
                  }}
                >
                  <div style={{
                    width: '40%',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: colors.text
                  }}>
                    {attr.trait_type}
                  </div>
                  <div style={{
                    width: '60%',
                    fontSize: '14px',
                    color: colors.textSecondary
                  }}>
                    {attr.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer (fixed) */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.background,
          position: 'sticky',
          bottom: 0,
          zIndex: 1
        }}>
          <Button
            className="w-full"
            style={{
              background: 'linear-gradient(to right, #a855f7, #6366f1)',
              color: 'white',
              height: '48px',
              fontSize: '15px',
              borderRadius: '12px',
              fontWeight: '500',
              boxShadow: `0 2px 8px ${colors.buttonShadow}`
            }}
            onClick={() => {
              if (tg && typeof (window as any).Telegram?.WebApp?.openLink === 'function') {
                (window as any).Telegram.WebApp.openLink(telegramLink)
              } else {
                window.open(telegramLink, '_blank')
              }
            }}
          >
            <Send className="w-5 h-5 mr-2" />
            Open in Telegram
          </Button>
        </div>
      </div>
    </div>
  )
}
