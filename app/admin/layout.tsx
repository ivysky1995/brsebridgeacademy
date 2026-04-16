import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, FileText, HelpCircle, Users, BarChart2, BookMarked } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { href: '/admin/lessons', label: 'Bài học', icon: <FileText className="w-4 h-4" /> },
    { href: '/admin/courses', label: 'Khóa học', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/admin/quizzes', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { href: '/admin/vocabulary', label: 'Từ vựng', icon: <BookMarked className="w-4 h-4" /> },
    { href: '/admin/users', label: 'Người dùng', icon: <Users className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-[rgba(0,0,0,0.08)] flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-[rgba(0,0,0,0.08)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-small font-bold text-text-primary">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-small text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.08)]">
          <Link href="/dashboard" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
            ← Về Dashboard
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
