// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Clock, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLessonsPage() {
  const supabase = await createClient()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, courses(title, tracks(title))')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 font-bold text-text-primary">Quản lý Bài học</h1>
        <Link
          href="/admin/lessons/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tạo bài học mới
        </Link>
      </div>

      <div className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.06)] bg-secondary">
              <th className="text-left px-4 py-3 text-caption font-semibold text-text-secondary uppercase tracking-wider">Tiêu đề</th>
              <th className="text-left px-4 py-3 text-caption font-semibold text-text-secondary uppercase tracking-wider">Khóa học</th>
              <th className="text-left px-4 py-3 text-caption font-semibold text-text-secondary uppercase tracking-wider">Thời gian</th>
              <th className="text-left px-4 py-3 text-caption font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(lessons ?? []).map((lesson: any) => (
              <tr key={lesson.id} className="border-b border-[rgba(0,0,0,0.04)] hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary text-small">{lesson.title}</div>
                  {lesson.is_free && (
                    <span className="text-caption text-primary">Miễn phí</span>
                  )}
                </td>
                <td className="px-4 py-3 text-small text-text-secondary">
                  {lesson.courses?.title ?? '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-small text-text-secondary">
                    <Clock className="w-3.5 h-3.5" />
                    {lesson.estimated_minutes} phút
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {lesson.is_published
                      ? <Eye className="w-3.5 h-3.5 text-primary" />
                      : <EyeOff className="w-3.5 h-3.5 text-text-secondary" />
                    }
                    <span className={`text-small font-medium ${lesson.is_published ? 'text-primary' : 'text-text-secondary'}`}>
                      {lesson.is_published ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/lessons/${lesson.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[rgba(0,0,0,0.1)] text-small font-medium text-text-primary hover:bg-secondary transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(lessons ?? []).length === 0 && (
          <div className="px-4 py-8 text-center text-text-secondary">
            Chưa có bài học nào.{' '}
            <Link href="/admin/lessons/new" className="text-primary font-medium">
              Tạo bài học đầu tiên →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
