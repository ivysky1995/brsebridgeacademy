// @ts-nocheck
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookOpen, Clock, ChevronRight, Lock } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export default async function CourseDetailPage({ params }: Props) {
  const supabase = await createClient()

  // Fetch course by slug
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      tracks ( title, slug ),
      lessons ( id, title, title_ja, is_free, order_index, estimated_minutes, is_published )
    `)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()
  
  const lessons = (course.lessons as any[])
    ?.filter((l: any) => l.is_published)
    ?.sort((a: any, b: any) => a.order_index - b.order_index) ?? []

  const totalMinutes = lessons.reduce((sum: number, l: any) => sum + (l.estimated_minutes ?? 0), 0)

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="bg-surface border-b border-[rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-small text-text-secondary mb-4">
            <Link href="/courses" className="hover:text-primary transition-colors">Khóa học</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{course.title}</span>
          </div>

          <h1 className="text-h1 font-bold text-text-primary mb-2">{course.title}</h1>
          {course.title_ja && (
            <p className="text-body text-text-secondary mb-3">{course.title_ja}</p>
          )}
          {course.description && (
            <p className="text-body text-text-secondary mb-4">{course.description}</p>
          )}

          <div className="flex items-center gap-4 text-small text-text-secondary">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {lessons.length} bài học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{totalMinutes} phút
            </span>
            {course.level && (
              <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-caption font-medium">
                {course.level === 'beginner' ? 'Cơ bản' : course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-h3 font-semibold text-text-primary mb-4">Danh sách bài học</h2>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            Chưa có bài học nào được công bố.
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson: any, index: number) => {
              const isAccessible = lesson.is_free || !!user
              const href = isAccessible
                ? (user ? `/learn/${lesson.id}` : `/courses/${params.slug}/lessons/${lesson.id}`)
                : '/login'

              return (
                <Link
                  key={lesson.id}
                  href={href}
                  className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] hover:border-primary/30 hover:shadow-card transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-small font-semibold text-text-secondary group-hover:bg-primary-light group-hover:text-primary transition-colors flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-text-primary truncate">{lesson.title}</p>
                    {lesson.title_ja && (
                      <p className="text-small text-text-secondary truncate">{lesson.title_ja}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {lesson.estimated_minutes && (
                      <span className="text-caption text-text-secondary">{lesson.estimated_minutes} phút</span>
                    )}
                    {lesson.is_free ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-caption font-medium">Miễn phí</span>
                    ) : !user ? (
                      <Lock className="w-4 h-4 text-text-secondary" />
                    ) : null}
                    <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA nếu chưa login */}
        {!user && (
          <div className="mt-8 p-6 bg-primary-light rounded-xl text-center">
            <p className="text-body font-medium text-text-primary mb-1">Đăng nhập để học tất cả bài</p>
            <p className="text-small text-text-secondary mb-4">3 bài đầu miễn phí — đăng ký để mở khóa toàn bộ</p>
            <div className="flex gap-3 justify-center">
              <Link href="/register" className="px-4 py-2 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 transition-opacity">
                Đăng ký miễn phí
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-md border border-primary text-primary text-small font-semibold hover:bg-white transition-colors">
                Đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}