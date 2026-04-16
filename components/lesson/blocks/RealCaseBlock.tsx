// @ts-nocheck
'use client'

import { useState } from 'react'
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import type { RealCaseBlock as RealCaseBlockType } from '@/types/app'

interface Props {
  block: RealCaseBlockType
}

export default function RealCaseBlock({ block }: Props) {
  const [revealed, setRevealed] = useState(false)
  const { data } = block

  return (
    <div className="rounded-lg overflow-hidden border border-[rgba(0,0,0,0.08)] shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border-l-4 border-warning">
        <Lightbulb className="w-5 h-5 text-warning shrink-0" />
        <div>
          <div className="text-caption text-warning font-semibold uppercase tracking-wider">
            Real Case
          </div>
          <h4 className="font-semibold text-text-primary mt-0.5">{data.scenario_title}</h4>
        </div>
      </div>

      {/* Body */}
      <div className="bg-surface px-5 py-4 space-y-4">
        {/* Context */}
        <div>
          <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Bối cảnh
          </div>
          <p className="text-body text-text-primary">{data.context}</p>
        </div>

        {/* Situation */}
        <div>
          <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Tình huống
          </div>
          <p className="text-body text-text-primary">{data.situation}</p>
        </div>

        {/* Reveal button */}
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary-light text-primary font-medium text-small transition-opacity hover:opacity-80"
          >
            <ChevronDown className="w-4 h-4" />
            Xem điều gì đã xảy ra
          </button>
        ) : (
          <div className="slide-down space-y-4">
            <div>
              <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Điều đã xảy ra
              </div>
              <p className="text-body text-text-primary">{data.what_happened}</p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-md bg-primary-light border border-primary/20">
              <span className="text-lg">💡</span>
              <div>
                <div className="text-caption font-semibold text-primary uppercase tracking-wider mb-1">
                  Bài học
                </div>
                <p className="text-body text-primary-dark font-medium">{data.takeaway}</p>
              </div>
            </div>

            <button
              onClick={() => setRevealed(false)}
              className="flex items-center gap-2 text-small text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Thu gọn
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

