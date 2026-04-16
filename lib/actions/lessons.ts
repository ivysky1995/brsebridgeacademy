// @ts-nocheck
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { XP_REWARDS } from '@/types/app'

export async function markLessonComplete(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Upsert progress
  const { error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      status: 'completed',
      progress_percent: 100,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })

  if (error) return { error: error.message }

  // Add XP
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_points')
    .eq('id', user.id)
    .single()

  if (profile) {
    await supabase
      .from('profiles')
      .update({ xp_points: (profile.xp_points ?? 0) + XP_REWARDS.COMPLETE_LESSON })
      .eq('id', user.id)
  }

  revalidatePath(`/learn/${lessonId}`)
  return { success: true, xpEarned: XP_REWARDS.COMPLETE_LESSON }
}

export async function updateLessonProgress(lessonId: string, progressPercent: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('lesson_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      status: progressPercent === 100 ? 'completed' : 'in_progress',
      progress_percent: progressPercent,
    }, { onConflict: 'user_id,lesson_id' })
}

export async function getLessonWithProgress(lessonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      *,
      courses (
        id, title, slug, order_index,
        tracks (id, title, slug)
      )
    `)
    .eq('id', lessonId)
    .single()

  if (error || !lesson) return null

  let progress = null
  if (user) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()
    progress = data
  }

  return { lesson, progress, user }
}

export async function getCourseLessons(courseId: string) {
  const supabase = await createClient()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, title_ja, is_free, order_index, estimated_minutes, is_published')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('order_index')

  return lessons ?? []
}

