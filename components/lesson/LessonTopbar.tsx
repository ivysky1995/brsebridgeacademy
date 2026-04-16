'use client'

import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

interface Props {
  courseTitle: string
  trackSlug: string
  lessonIndex: number
  totalLessons: number
  progress: number // 0-100
  xpEarned?: number
}

export default function LessonTopbar({
  courseTitle,
  trackSlug,
  lessonIndex,
  totalLessons,
  progress,
  xpEarned,
}: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-surface border-b border-[rgba(0,0,0,0.08)] flex items-center px-4 gap-4">
      {/* Back */}
      <Link
        href={`/courses/${trackSlug}`}
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-small font-medium hidden sm:inline">Quay lại</span>
      </Link>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <div className="text-caption text-text-secondary truncate">
          {courseTitle} · Bài {lessonIndex}/{totalLessons}
        </div>
        {/* Progress bar */}
        <div className="mt-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* XP badge */}
      {xpEarned !== undefined && (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light shrink-0">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-caption font-bold text-primary">+{xpEarned} XP</span>
        </div>
      )}
    </header>
  )
}
