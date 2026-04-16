// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import type { VocabHighlight } from '@/types/app'

interface Props {
  vocab: VocabHighlight
  style: { left: number; top: number }
  onClose: () => void
  onAddToVocab: () => void
}

export default function VocabHoverCard({ vocab, style, onClose, onAddToVocab }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-50 slide-down"
      style={{ left: style.left, top: style.top }}
    >
      <div className="bg-surface rounded-lg shadow-modal border border-[rgba(0,0,0,0.1)] p-4 w-64">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-h4 font-bold text-text-primary">{vocab.term}</div>
            <div className="text-small text-text-secondary">{vocab.reading}</div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 border-t border-[rgba(0,0,0,0.08)]">
          <div className="text-small text-text-secondary mb-0.5">Tiếng Việt</div>
          <div className="text-body font-medium text-text-primary">{vocab.meaning_vi}</div>
        </div>

        <button
          onClick={onAddToVocab}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-white text-small font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          + Thêm vào My Deck
        </button>
      </div>
    </div>
  )
}

