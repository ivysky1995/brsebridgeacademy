// @ts-nocheck
'use server'

import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { XP_REWARDS } from '@/types/app'

export async function addVocabToDeck(deckId: string, vocab: {
  vocab_id?: string
  term: string
  term_ja?: string
  reading?: string
  meaning_vi: string
  example?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('user_vocab_items').insert({
    deck_id: deckId,
    vocab_id: vocab.vocab_id ?? null,
    term: vocab.term,
    term_ja: vocab.term_ja ?? null,
    reading: vocab.reading ?? null,
    meaning_vi: vocab.meaning_vi,
    example: vocab.example ?? null,
    mastery_level: 0,
    next_review_at: new Date().toISOString(),
  })

  if (error) return { error: error.message }

  // Award XP for adding vocab
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_points')
    .eq('id', user.id)
    .single()

  if (profile) {
    await supabase
      .from('profiles')
      .update({ xp_points: (profile.xp_points ?? 0) + XP_REWARDS.ADD_VOCAB })
      .eq('id', user.id)
  }

  revalidatePath('/vocabulary')
  return { success: true }
}

export async function createDeck(name: string, description?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

const { data, error } = await supabase
    .from('user_vocab_decks')
    .insert({ user_id: user.id, name, description: description ?? null })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/vocabulary')
  return { success: true, deck: data as any }
}

// SM2 algorithm for spaced repetition
export async function reviewCard(itemId: string, quality: 0 | 1 | 2 | 3) {
  // quality: 0=forgot, 1=hard, 2=good, 3=easy
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: item } = await supabase
    .from('user_vocab_items')
    .select('mastery_level, next_review_at')
    .eq('id', itemId)
    .single()

  if (!item) return { error: 'Item not found' }

  let newMastery = item.mastery_level
  let daysUntilReview = 1

  if (quality >= 2) {
    // Correct answer  Eincrease mastery
    newMastery = Math.min(5, newMastery + 1)
    const intervals = [1, 2, 4, 8, 14, 30]
    daysUntilReview = intervals[newMastery] ?? 30
  } else {
    // Wrong  Ereset mastery
    newMastery = Math.max(0, newMastery - 1)
    daysUntilReview = 1
  }

  const nextReview = new Date(Date.now() + daysUntilReview * 86400000).toISOString()

  await supabase
    .from('user_vocab_items')
    .update({ mastery_level: newMastery, next_review_at: nextReview })
    .eq('id', itemId)

  return { success: true }
}

