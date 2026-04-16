'use client'

import { useState, useRef, useEffect } from 'react'
import type { TheoryBlock as TheoryBlockType, VocabHighlight } from '@/types/app'
import VocabHoverCard from '@/components/vocabulary/VocabHoverCard'

interface Props {
  block: TheoryBlockType
  onAddVocab?: (vocab: VocabHighlight) => void
}

export default function TheoryBlock({ block, onAddVocab }: Props) {
  const [hoveredVocab, setHoveredVocab] = useState<VocabHighlight | null>(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  // Inject vocab highlight markup into HTML
  function processHtml(html: string, highlights: VocabHighlight[]): string {
    let result = html
    highlights.forEach((v) => {
      const escaped = v.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(?<![<>])${escaped}(?![^<]*>)`, 'g')
      result = result.replace(
        regex,
        `<span class="vocab-highlight" data-term="${v.term}">${v.term}</span>`
      )
    })
    return result
  }

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('vocab-highlight')) {
        const term = target.dataset.term
        const vocab = block.data.vocab_highlights.find(v => v.term === term)
        if (vocab) {
          const rect = target.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          setPopupPos({
            x: rect.left - containerRect.left,
            y: rect.bottom - containerRect.top + 8,
          })
          setHoveredVocab(vocab)
        }
      }
    }

    container.addEventListener('click', handler)
    return () => container.removeEventListener('click', handler)
  }, [block.data.vocab_highlights])

  const processedHtml = processHtml(block.data.html, block.data.vocab_highlights)

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="tiptap-content text-text-primary"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />

      {hoveredVocab && (
        <VocabHoverCard
          vocab={hoveredVocab}
          style={{ left: popupPos.x, top: popupPos.y }}
          onClose={() => setHoveredVocab(null)}
          onAddToVocab={() => {
            onAddVocab?.(hoveredVocab)
            setHoveredVocab(null)
          }}
        />
      )}
    </div>
  )
}
