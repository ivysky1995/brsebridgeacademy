'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { VocabSpotlightBlock as VocabSpotlightBlockType, VocabItem } from '@/types/app'
import { cn } from '@/lib/utils/cn'

interface Props {
  block: VocabSpotlightBlockType
  onAddVocab?: (item: VocabItem, deckId?: string) => void
}

interface FlipCardProps {
  item: VocabItem
  onAdd?: () => void
}

function FlipCard({ item, onAdd }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flip-card h-44 cursor-pointer group" onClick={() => setFlipped(!flipped)}>
      <div className={cn('flip-card-inner w-full h-full', flipped && 'flipped')}>
        {/* Front: JP term + reading */}
        <div className="flip-card-front w-full h-full rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card bg-surface flex flex-col items-center justify-center p-4 relative">
          {onAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd() }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white rounded-md p-1"
              title="Thêm vào Deck"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="text-xl font-bold text-text-primary text-center">{item.term}</div>
          <div className="text-small text-text-secondary mt-1 text-center">{item.reading}</div>
          {item.category && (
            <span className="mt-3 px-2 py-0.5 rounded-full text-caption bg-primary-light text-primary font-medium">
              {item.category}
            </span>
          )}
          <div className="mt-3 text-caption text-text-secondary">Click để flip ↩</div>
        </div>

        {/* Back: VN meaning + example */}
        <div className="flip-card-back w-full h-full rounded-lg border border-primary/30 shadow-card bg-primary-light flex flex-col justify-center p-4">
          <div className="text-body font-semibold text-primary-dark">{item.meaning_vi}</div>
          {item.meaning_en && (
            <div className="text-small text-text-secondary mt-0.5">{item.meaning_en}</div>
          )}
          <div className="mt-3 pt-3 border-t border-primary/20">
            <div className="text-small text-primary-dark italic">{item.example_ja}</div>
            <div className="text-caption text-text-secondary mt-1">{item.example_vi}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VocabSpotlightBlock({ block, onAddVocab }: Props) {
  const { data } = block

  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] overflow-hidden shadow-card">
      <div className="flex items-center gap-2 px-5 py-3 bg-secondary border-b border-[rgba(0,0,0,0.06)]">
        <span className="text-lg">📚</span>
        <span className="font-semibold text-text-primary">Vocab Spotlight</span>
        <span className="ml-auto text-caption text-text-secondary">
          Click để flip · Hover để thêm vào deck
        </span>
      </div>

      <div className="bg-surface p-5">
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {data.items.map((item, index) => (
            <FlipCard
              key={index}
              item={item}
              onAdd={onAddVocab ? () => onAddVocab(item) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
