// @ts-nocheck
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { XP_REWARDS } from '@/types/app'

interface SubmitQuizParams {
  quizId: string
  answers: Record<string, string>
  timeSpentSeconds: number
}

export async function submitQuiz({ quizId, answers, timeSpentSeconds }: SubmitQuizParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Get questions with correct answers
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id, options')
    .eq('quiz_id', quizId)

  if (!questions) return { error: 'Quiz not found' }

  // Calculate score
  let correct = 0
  questions.forEach(q => {
    const opts = (q.options as unknown) as Array<{ id: string; is_correct: boolean }>
    const correctOpt = opts.find(o => o.is_correct)
    if (correctOpt && answers[q.id] === correctOpt.id) correct++
  })

  const total = questions.length
  const score = Math.round((correct / total) * 100)

  // Get passing score
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('passing_score')
    .eq('id', quizId)
    .single()

  const passed = score >= (quiz?.passing_score ?? 70)
  const isPerfect = score === 100

  // Save attempt
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    quiz_id: quizId,
    score,
    total_questions: total,
    correct_answers: correct,
    time_spent_seconds: timeSpentSeconds,
    answers,
  })

  if (error) return { error: error.message }

  // Award XP
  if (passed) {
    const xpToAdd = isPerfect ? XP_REWARDS.PERFECT_QUIZ : XP_REWARDS.COMPLETE_QUIZ_PASSING

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp_points')
      .eq('id', user.id)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ xp_points: (profile.xp_points ?? 0) + xpToAdd })
        .eq('id', user.id)
    }

    revalidatePath('/dashboard')
    return { success: true, score, correct, total, passed, xpEarned: xpToAdd }
  }

  return { success: true, score, correct, total, passed, xpEarned: 0 }
}

