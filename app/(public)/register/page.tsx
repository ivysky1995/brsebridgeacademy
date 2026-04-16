'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-h2 font-bold text-text-primary mb-2">Đăng ký thành công!</h2>
          <p className="text-body text-text-secondary">Đang chuyển đến dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-h2 font-bold text-text-primary">Tạo tài khoản</h1>
          <p className="text-small text-text-secondary mt-1">Miễn phí — không cần thẻ tín dụng</p>
        </div>

        <div className="bg-surface rounded-xl shadow-card border border-[rgba(0,0,0,0.08)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-small font-medium text-text-primary mb-1.5">Họ tên</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-body text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-body text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-primary mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-body text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-small text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-primary text-white font-semibold text-body hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
            </button>
          </form>
        </div>

        <p className="text-center text-small text-text-secondary mt-5">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary font-medium hover:opacity-80 transition-opacity">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}