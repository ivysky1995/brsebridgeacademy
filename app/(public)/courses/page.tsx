// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: tracks } = await supabase
    .from('tracks')
    .select(`
      *,
      courses (
        id, slug, title, title_ja, description, level, order_index,
        lessons (id)
      )
    `)
    .eq('is_published', true)
    .order('order_index')

  const levelLabel: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-h1 font-bold text-text-primary mb-2">Khóa học</h1>
      <p className="text-body text-text-secondary mb-10">
        Học IT tại Nhật theo lềEtrình rõ ràng  Etừ cơ bản đến thực chiến
      </p>

      <div className="space-y-12">
        {(tracks ?? []).map(track => (
          <div key={track.id}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{track.icon ?? '📚'}</span>
              <div>
                <h2 className="text-h2 font-bold text-text-primary">{track.title}</h2>
                {track.title_ja && (
                  <div className="text-small text-text-secondary">{track.title_ja}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(track.courses ?? [])
                .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
                .map((course: {
                  id: string
                  slug: string
                  title: string
                  title_ja: string | null
                  description: string | null
                  level: string | null
                  lessons: { id: string }[]
                }) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-5 hover:shadow-modal transition-shadow flex flex-col"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-text-primary">{course.title}</h3>
                      {course.title_ja && (
                        <div className="text-caption text-text-secondary">{course.title_ja}</div>
                      )}
                    </div>
                    {course.level && (
                      <span className="shrink-0 ml-3 px-2 py-0.5 rounded-full text-caption font-medium bg-primary-light text-primary">
                        {levelLabel[course.level] ?? course.level}
                      </span>
                    )}
                  </div>

                  {course.description && (
                    <p className="text-small text-text-secondary mb-4 flex-1">{course.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-caption text-text-secondary">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.lessons?.length ?? 0} bài học
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

