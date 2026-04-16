import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flame, Zap, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { getLevelFromXP, getNextLevel } from '@/types/app'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Last lesson in progress
  const { data: inProgressLessons } = await supabase
    .from('lesson_progress')
    .select('*, lessons(id, title, estimated_minutes, courses(id, title, slug))')
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .order('completed_at', { ascending: false, nullsFirst: false })
    .limit(1)

  // Completed count this week
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const { count: weeklyCompleted } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .gte('completed_at', weekAgo)

  // Vocab due today
  const { data: vocabDue } = await supabase
    .from('user_vocab_items')
    .select('*, user_vocab_decks!inner(user_id)')
    .eq('user_vocab_decks.user_id', user.id)
    .lte('next_review_at', new Date().toISOString())
    .limit(5)

  // Track progress
  const { data: tracks } = await supabase
    .from('tracks')
    .select('id, slug, title, icon, courses(id, lessons(id))')
    .eq('is_published', true)
    .order('order_index')

  const xp = (profile as any)?.xp_points ?? 0
  const currentLevel = getLevelFromXP(xp)
  const nextLevel = getNextLevel(xp)
  const progressToNext = nextLevel
    ? Math.round(((xp - currentLevel.xp_required) / (nextLevel.xp_required - currentLevel.xp_required)) * 100)
    : 100

  const continueLesson = inProgressLessons?.[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">
            Xin chào, {profile?.full_name?.split(' ').pop() ?? 'bạn'}! 👋
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {(profile?.streak_count ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-warning text-small font-semibold">
                <Flame className="w-4 h-4" />
                {profile?.streak_count ?? 0} ngày liên tiếp
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Tổng XP',
            value: `${xp.toLocaleString()} XP`,
            icon: <Zap className="w-4 h-4 text-primary" />,
          },
          {
            label: 'Cấp độ',
            value: `Lv.${currentLevel.level} ${currentLevel.label}`,
            icon: <span className="text-sm">⭐</span>,
          },
          {
            label: 'Từ vựng cần ôn',
            value: `${vocabDue?.length ?? 0} từ`,
            icon: <BookOpen className="w-4 h-4 text-accent" />,
          },
          {
            label: 'Bài tuần này',
            value: `${weeklyCompleted ?? 0} bài`,
            icon: <CheckCircle className="w-4 h-4 text-primary" />,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-4">
            <div className="flex items-center gap-1.5 text-text-secondary mb-1">
              {stat.icon}
              <span className="text-caption">{stat.label}</span>
            </div>
            <div className="text-body font-bold text-text-primary">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Level progress */}
      {nextLevel && (
        <div className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-small font-semibold text-text-primary">
              {currentLevel.label} → {nextLevel.label}
            </div>
            <div className="text-small text-text-secondary">
              {xp.toLocaleString()} / {nextLevel.xp_required.toLocaleString()} XP
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full progress-bar"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2">
          <h2 className="text-body font-bold text-text-primary mb-3">Tiếp tục học</h2>
          {continueLesson ? (
            <Link
              href={`/learn/${(continueLesson as unknown as { lessons: { id: string } }).lessons.id}`}
              className="block bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-5 hover:shadow-modal transition-shadow"
            >
              <div className="text-caption text-text-secondary mb-1">
                {((continueLesson as unknown as { lessons: { courses: { title: string } } }).lessons as unknown as { courses: { title: string } }).courses?.title}
              </div>
              <h3 className="font-semibold text-text-primary mb-3">
                {(continueLesson as unknown as { lessons: { title: string } }).lessons.title}
              </h3>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-primary rounded-full progress-bar"
                  style={{ width: `${continueLesson.progress_percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-caption text-text-secondary">
                  {continueLesson.progress_percent}% hoàn thành
                </span>
                <div className="flex items-center gap-1 text-small font-medium text-primary">
                  Tiếp tục
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/courses"
              className="block bg-surface rounded-lg border-2 border-dashed border-[rgba(0,0,0,0.1)] p-8 text-center hover:border-primary/30 transition-colors"
            >
              <BookOpen className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-body font-medium text-text-primary mb-1">Bắt đầu học ngay</p>
              <p className="text-small text-text-secondary">Chọn khóa học phù hợp với bạn</p>
            </Link>
          )}
        </div>

        {/* Vocab due */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body font-bold text-text-primary">Ôn từ vựng hôm nay</h2>
            {(vocabDue?.length ?? 0) > 0 && (
              <Link href="/vocabulary" className="text-small text-primary font-medium hover:opacity-80 transition-opacity">
                Xem tất cả
              </Link>
            )}
          </div>

          {(vocabDue?.length ?? 0) > 0 ? (
            <div className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-4">
              <div className="space-y-2 mb-3">
                {vocabDue?.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-[rgba(0,0,0,0.06)] last:border-0">
                    <div>
                      <span className="text-small font-medium text-text-primary">{item.term}</span>
                      {item.term_ja && (
                        <span className="text-caption text-text-secondary ml-2">{item.term_ja}</span>
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i < (item.mastery_level ?? 0) ? 'bg-primary' : 'bg-secondary'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/vocabulary"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-primary text-white text-small font-medium hover:opacity-90 transition-opacity"
              >
                Bắt đầu ôn tập →
              </Link>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-4 text-center">
              <p className="text-small text-text-secondary">Không có từ nào cần ôn hôm nay 🎉</p>
              <Link href="/vocabulary" className="mt-2 inline-block text-small text-primary font-medium">
                Quản lý vocab deck →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
