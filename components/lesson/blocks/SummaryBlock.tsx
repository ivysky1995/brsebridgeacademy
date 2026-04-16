// @ts-nocheck
'use client'

import { Check, ChevronRight } from 'lucide-react'
import type { SummaryBlock as SummaryBlockType } from '@/types/app'
import Link from 'next/link'

interface Props {
  block: SummaryBlockType
  nextLessonId?: string
}

export default function SummaryBlock({ block, nextLessonId }: Props) {
  const { data } = block

  return (
    <div className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-card">
      {/* Gradient top border effect */}
      <div className="h-1 bg-gradient-to-r from-primary to-accent" />

      <div className="bg-surface px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📝</span>
          <h4 className="font-semibold text-text-primary">Tóm tắt bài học</h4>
        </div>

        {/* Key points */}
        <div className="space-y-3 mb-5">
          {data.key_points.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-body text-text-primary">{point}</p>
            </div>
          ))}
        </div>

        {/* Vocab recap */}
        {data.vocab_recap.length > 0 && (
          <div className="mb-5">
            <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Từ vựng trong bài
            </div>
            <div className="flex flex-wrap gap-2">
              {data.vocab_recap.map((term, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary-light text-primary text-small font-medium cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next lesson teaser */}
        {data.next_lesson_teaser && (
          <div className={`rounded-md ${nextLessonId ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}>
            {nextLessonId ? (
              <Link
                href={`/learn/${nextLessonId}`}
                className="flex items-center justify-between p-4 rounded-md bg-secondary border border-[rgba(0,0,0,0.08)] hover:border-primary/30 transition-colors"
              >
                <div>
                  <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
                    Bài tiếp theo
                  </div>
                  <div className="text-body font-medium text-text-primary">
                    {data.next_lesson_teaser}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-primary shrink-0" />
              </Link>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-md bg-secondary border border-[rgba(0,0,0,0.08)]">
                <div>
                  <div className="text-caption font-semibold text-text-secondary uppercase tracking-wider mb-0.5">
                    Bài tiếp theo
                  </div>
                  <div className="text-body font-medium text-text-primary">
                    {data.next_lesson_teaser}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

