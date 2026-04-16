'use client'

import { useState } from 'react'
import type { DialogueBlock as DialogueBlockType } from '@/types/app'
import { cn } from '@/lib/utils/cn'

interface Props {
  block: DialogueBlockType
}

export default function DialogueBlock({ block }: Props) {
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set())
  const [allRevealed, setAllRevealed] = useState(false)
  const { data } = block

  const toggleLine = (index: number) => {
    setRevealedLines(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const toggleAll = () => {
    if (allRevealed) {
      setRevealedLines(new Set())
      setAllRevealed(false)
    } else {
      setRevealedLines(new Set(data.lines.map((_, i) => i)))
      setAllRevealed(true)
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-[rgba(0,0,0,0.08)] shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-secondary border-b border-[rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗣️</span>
          <span className="text-small font-semibold text-text-secondary">
            {data.scene}
          </span>
        </div>
        <button
          onClick={toggleAll}
          className="text-small text-primary font-medium hover:opacity-80 transition-opacity"
        >
          {allRevealed ? 'Ẩn tất cả dịch' : '[Xem tất cả dịch]'}
        </button>
      </div>

      {/* Dialogue lines */}
      <div className="bg-surface p-5 space-y-4">
        {data.lines.map((line, index) => {
          const isJP = line.speaker === 'jp'
          const isRevealed = revealedLines.has(index)

          return (
            <div
              key={index}
              className={cn('flex flex-col', isJP ? 'items-start' : 'items-end')}
            >
              {/* Speaker label */}
              <span className="text-caption text-text-secondary mb-1 px-1">
                {line.speaker_label}
              </span>

              {/* Bubble */}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-3',
                  isJP
                    ? 'bg-secondary text-text-primary rounded-tl-none'
                    : 'bg-primary text-white rounded-tr-none'
                )}
              >
                <p className="font-medium">{line.text_ja}</p>

                {isRevealed && (
                  <p className={cn(
                    'text-small mt-2 pt-2 border-t',
                    isJP ? 'border-[rgba(0,0,0,0.1)] text-text-secondary' : 'border-white/20 text-white/80'
                  )}>
                    {line.text_vi}
                  </p>
                )}

                <button
                  onClick={() => toggleLine(index)}
                  className={cn(
                    'mt-2 text-caption font-medium transition-opacity hover:opacity-80',
                    isJP ? 'text-primary' : 'text-white/70'
                  )}
                >
                  {isRevealed ? '[Ẩn dịch]' : '[Xem dịch]'}
                </button>
              </div>

              {/* Note annotation */}
              {line.note && (
                <p className="text-caption text-text-secondary italic mt-1 px-1 max-w-[80%]">
                  💬 {line.note}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
