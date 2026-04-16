'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createDeck } from '@/lib/actions/vocabulary'
import Link from 'next/link'
import { Plus, BookOpen, Layers } from 'lucide-react'

interface Deck {
  id: string
  name: string
  description: string | null
  created_at: string
  item_count?: number
  due_count?: number
}

export default function VocabularyPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: deckList } = await supabase
        .from('user_vocab_decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!deckList) { setLoading(false); return }

      // Get item counts
      const decksWithCounts = await Promise.all(
        deckList.map(async (deck) => {
          const { count: totalCount } = await supabase
            .from('user_vocab_items')
            .select('*', { count: 'exact', head: true })
            .eq('deck_id', deck.id)

          const { count: dueCount } = await supabase
            .from('user_vocab_items')
            .select('*', { count: 'exact', head: true })
            .eq('deck_id', deck.id)
            .lte('next_review_at', new Date().toISOString())

          return { ...deck, item_count: totalCount ?? 0, due_count: dueCount ?? 0 }
        })
      )

      setDecks(decksWithCounts)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)

    const result = await createDeck(newName.trim())
    if (result.success && result.deck) {
      setDecks(prev => [{ ...result.deck, item_count: 0, due_count: 0 }, ...prev])
      setNewName('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-secondary rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 font-bold text-text-primary">Từ vựng của tôi</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tạo Deck mới
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-surface rounded-lg border-2 border-primary/20 p-5 mb-6 slide-down">
          <h3 className="font-semibold text-text-primary mb-3">Tạo Deck mới</h3>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Tên deck (vd: BrSE Terms, SAP Vocab...)"
              className="flex-1 px-3 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="px-5 py-2.5 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {creating ? 'Đang tạo...' : 'Tạo'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-small font-medium text-text-secondary hover:bg-secondary"
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      {/* Decks grid */}
      {decks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => (
            <Link
              key={deck.id}
              href={`/vocabulary/${deck.id}`}
              className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-5 hover:shadow-modal transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                {(deck.due_count ?? 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-caption font-bold">
                    {deck.due_count} cần ôn
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-text-primary mb-1">{deck.name}</h3>
              {deck.description && (
                <p className="text-small text-text-secondary mb-3">{deck.description}</p>
              )}

              <div className="flex items-center gap-1 text-caption text-text-secondary">
                <BookOpen className="w-3.5 h-3.5" />
                {deck.item_count} từ
              </div>

              {(deck.due_count ?? 0) > 0 && (
                <div className="mt-3 flex items-center justify-center w-full py-2 rounded-md bg-primary text-white text-small font-medium">
                  Ôn tập ngay →
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-lg border border-[rgba(0,0,0,0.08)]">
          <BookOpen className="w-12 h-12 text-text-secondary mx-auto mb-3" />
          <h3 className="text-body font-semibold text-text-primary mb-1">Chưa có deck nào</h3>
          <p className="text-small text-text-secondary mb-4">
            Tạo deck đầu tiên và thêm từ vựng từ bài học
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Tạo Deck đầu tiên
          </button>
        </div>
      )}
    </div>
  )
}
