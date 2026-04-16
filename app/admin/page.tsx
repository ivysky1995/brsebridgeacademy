// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, Users, BookOpen, HelpCircle, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: lessonCount },
    { count: userCount },
    { count: courseCount },
    { count: quizCount },
  ] = await Promise.all([
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('quizzes').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Bài học', value: lessonCount ?? 0, icon: <FileText className="w-5 h-5 text-primary" />, href: '/admin/lessons' },
    { label: 'Người dùng', value: userCount ?? 0, icon: <Users className="w-5 h-5 text-accent" />, href: '/admin/users' },
    { label: 'Khóa học', value: courseCount ?? 0, icon: <BookOpen className="w-5 h-5 text-warning" />, href: '/admin/courses' },
    { label: 'Quiz', value: quizCount ?? 0, icon: <HelpCircle className="w-5 h-5 text-danger" />, href: '/admin/quizzes' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-h1 font-bold text-text-primary">Admin Dashboard</h1>
        <Link
          href="/admin/lessons/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tạo bài học mới
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-5 hover:shadow-modal transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-small text-text-secondary">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-surface rounded-lg border border-[rgba(0,0,0,0.08)] shadow-card p-6">
        <h2 className="text-body font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Tạo bài học', href: '/admin/lessons/new', icon: <FileText className="w-4 h-4" /> },
            { label: 'Tạo khóa học', href: '/admin/courses/new', icon: <BookOpen className="w-4 h-4" /> },
            { label: 'Tạo quiz', href: '/admin/quizzes/new', icon: <HelpCircle className="w-4 h-4" /> },
          ].map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 px-4 py-3 rounded-md border border-[rgba(0,0,0,0.1)] text-small font-medium text-text-primary hover:bg-secondary transition-colors"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

