// @ts-nocheck
'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'

interface Props {
  prevLessonId?: string
  nextLessonId?: string
  lessonIndex: number
  estimatedMinutes: number
  isCompleted: boolean
  onMarkComplete: () => void
  isMarkingComplete?: boolean
}

export default function LessonBottomNav({
  prevLessonId,
  nextLessonId,
  lessonIndex,
  estimatedMinutes,
  isCompleted,
  onMarkComplete,
  isMarkingComplete,
}: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-13 bg-surface border-t border-[rgba(0,0,0,0.08)] flex items-center px-4 gap-3">
      {/* Prev */}
      {prevLessonId ? (
        <Link
          href={`/learn/${prevLessonId}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-secondary transition-colors text-small font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Bài trước
        </Link>
      ) : (
        <div className="w-[90px]" />
      )}

      {/* Center info */}
      <div className="flex-1 flex items-center justify-center gap-3 text-small text-text-secondary">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          ~{estimatedMinutes} phút
        </div>
      </div>

      {/* Mark complete / Next */}
      {isCompleted ? (
        nextLessonId ? (
          <Link
            href={`/learn/${nextLessonId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-small font-medium hover:opacity-90 transition-opacity"
          >
            Bài tiếp
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary-light text-primary text-small font-medium">
            <CheckCircle className="w-4 h-4" />
            Hoàn thành
          </div>
        )
      ) : (
        <button
          onClick={onMarkComplete}
          disabled={isMarkingComplete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-small font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isMarkingComplete ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Đánh dấu hoàn thành
        </button>
      )}
    </nav>
  )
}

