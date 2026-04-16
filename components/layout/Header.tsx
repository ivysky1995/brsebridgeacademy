import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'
import { Flame, Zap, BookOpen } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, xp_points, streak_count')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="h-16 bg-surface border-b border-[rgba(0,0,0,0.08)] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-text-primary text-body hidden sm:inline">
            BrSE Bridge
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5">
          <Link href="/courses" className="text-small text-text-secondary hover:text-text-primary transition-colors font-medium">
            Khóa học
          </Link>
          {user && (
            <Link href="/dashboard" className="text-small text-text-secondary hover:text-text-primary transition-colors font-medium">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {user && profile ? (
          <div className="flex items-center gap-4">
            {/* Streak */}
            {(profile.streak_count ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-warning text-small font-semibold">
                <Flame className="w-4 h-4" />
                {profile.streak_count}
              </div>
            )}

            {/* XP */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary text-small font-semibold">
              <Zap className="w-3.5 h-3.5" />
              {(profile.xp_points ?? 0).toLocaleString()}
            </div>

            {/* Avatar + sign out */}
            <div className="flex items-center gap-2">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? ''}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-small font-bold text-text-secondary">
                  {(profile.full_name ?? user.email ?? '?')[0].toUpperCase()}
                </div>
              )}

              <form action={signOut}>
                <button
                  type="submit"
                  className="text-small text-text-secondary hover:text-text-primary transition-colors"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-small text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md bg-primary text-white text-small font-semibold hover:opacity-90 transition-opacity"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
