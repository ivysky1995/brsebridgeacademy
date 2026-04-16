// @ts-nocheck
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-[rgba(0,0,0,0.08)] py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-white" />
          </div>
          <span className="text-small font-semibold text-text-primary">BrSE Bridge Academy</span>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/courses" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            Khóa học
          </Link>
          <Link href="/login" className="text-small text-text-secondary hover:text-text-primary transition-colors">
            Đăng nhập
          </Link>
        </div>

        <p className="text-caption text-text-secondary">
          © 2026 BrSE Bridge Academy · Học IT tại Nhật
        </p>
      </div>
    </footer>
  )
}

