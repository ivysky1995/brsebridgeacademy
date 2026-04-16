// @ts-nocheck
'use client'

import Link from 'next/link'
import { use, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { markLessonComplete } from '@/lib/actions/lessons'
import LessonTopbar from '@/components/lesson/LessonTopbar'
import LessonBottomNav from '@/components/lesson/LessonBottomNav'
import TheoryBlock from '@/components/lesson/blocks/TheoryBlock'
import RealCaseBlock from '@/components/lesson/blocks/RealCaseBlock'
import DialogueBlock from '@/components/lesson/blocks/DialogueBlock'
import VocabSpotlightBlock from '@/components/lesson/blocks/VocabSpotlightBlock'
import QuickCheckBlock from '@/components/lesson/blocks/QuickCheckBlock'
import SummaryBlock from '@/components/lesson/blocks/SummaryBlock'
import XPPopup from '@/components/gamification/XPPopup'
import type { LessonContent, LessonBlock } from '@/types/app'

interface Props {
  params: Promise<{ lessonId: string }>
}

interface LessonState {
  id: string
  title: string
  content: LessonContent | null
  estimated_minutes: number
  courses: {
    id: string
    title: string
    slug: string
    order_index: number
  } | null
}

interface ProgressState {
  status: string
  progress_percent: number
}

export default function LearnPage({ params }: Props) {
  const { lessonId } = use(params)
  const [lesson, setLesson] = useState<LessonState | null>(null)
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [adjacentLessons, setAdjacentLessons] = useState<{ prev?: string; next?: string }>({})
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [xpPopup, setXpPopup] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch lesson
      const { data: lessonRaw } = await supabase
        .from('lessons')
        .select('*, courses(id, title, slug, order_index)')
        .eq('id', lessonId)
        .single()

      if (!lessonRaw) { setLoading(false); return }

      const lessonData = lessonRaw as any
      setLesson(lessonData as LessonState)

      // Get adjacent lessons
      if (lessonData.course_id) {
        const { data: siblingsRaw } = await supabase
          .from('lessons')
          .select('id, order_index')
          .eq('course_id', lessonData.course_id)
          .eq('is_published', true)
          .order('order_index')

        const siblings = (siblingsRaw as any[]) ?? []
        const idx = siblings.findIndex((s: any) => s.id === lessonId)
        setAdjacentLessons({
          prev: idx > 0 ? siblings[idx - 1].id : undefined,
          next: idx < siblings.length - 1 ? siblings[idx + 1].id : undefined,
        })
      }

      // Get progress
      if (user) {
        const { data: progRaw } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single()

        const prog = progRaw as any
        if (prog) {
          setProgress({ status: prog.status, progress_percent: prog.progress_percent })
          setIsCompleted(prog.status === 'completed')
        }
      }

      setLoading(false)
    }
    load()
  }, [lessonId])

  const handleMarkComplete = useCallback(async () => {
    setIsMarkingComplete(true)
    const result = await markLessonComplete(lessonId)
    if (result.success) {
      setIsCompleted(true)
      if (result.xpEarned) setXpPopup(result.xpEarned)
    }
    setIsMarkingComplete(false)
  }, [lessonId])

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center text-text-secondary">
        Bài học không tồn tại.
      </div>
    )
  }

  const content = lesson.content as LessonContent | null
  const blocks = content?.blocks ?? []

  function renderBlock(block: LessonBlock) {
    switch (block.type) {
      case 'theory':
        return <TheoryBlock key={block.id} block={block} />
      case 'real_case':
        return <RealCaseBlock key={block.id} block={block} />
      case 'dialogue':
        return <DialogueBlock key={block.id} block={block} />
      case 'vocab_spotlight':
        return <VocabSpotlightBlock key={block.id} block={block} />
      case 'quick_check':
        return <QuickCheckBlock key={block.id} block={block} />
      case 'summary':
        return <SummaryBlock key={block.id} block={block} nextLessonId={adjacentLessons.next} />
      default:
        return null
    }
  }

  return (
    <>
      {xpPopup && <XPPopup xp={xpPopup} onDone={() => setXpPopup(null)} />}

      <LessonTopbar
        courseTitle={lesson.courses?.title ?? ''}
        trackSlug={lesson.courses?.slug ?? ''}
        lessonIndex={1}
        totalLessons={10}
        progress={isCompleted ? 100 : progress?.progress_percent ?? 0}
        xpEarned={isCompleted ? 50 : undefined}
      />

      <div className="pt-14 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-h1 font-bold text-text-primary mb-2">{lesson.title}</h1>
            <div className="flex items-center gap-3 text-small text-text-secondary">
              <span>~{lesson.estimated_minutes} phút</span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  ✓ Đã hoàn thành
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {blocks.sort((a, b) => a.order - b.order).map(renderBlock)}
          </div>
        </div>
      </div>

      <LessonBottomNav
        prevLessonId={adjacentLessons.prev}
        nextLessonId={adjacentLessons.next}
        lessonIndex={1}
        estimatedMinutes={lesson.estimated_minutes}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
        isMarkingComplete={isMarkingComplete}
      />
    </>
  )
}
