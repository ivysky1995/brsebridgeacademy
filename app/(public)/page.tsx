// @ts-nocheck
import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Trophy } from 'lucide-react'

export default function LandingPage() {
  const tracks = [
    { icon: '📋', title: 'IT Passport', title_ja: 'ITパスポート', desc: 'Luyen thi chung chi IT Nhat Ban', color: 'bg-blue-50 border-blue-200', slug: 'it-passport' },
    { icon: '🌉', title: 'BrSE Skills', title_ja: 'ブリッジSEスキル', desc: 'Ky nang Bridge SE thuc chien', color: 'bg-green-50 border-green-200', slug: 'brse-skills' },
    { icon: '🔷', title: 'SAP Japan', title_ja: 'SAP日本語', desc: 'SAP consultant tai thi truong Nhat', color: 'bg-purple-50 border-purple-200', slug: 'sap-japan' },
    { icon: '🎌', title: 'Business Japanese IT', title_ja: 'ビジネス日本語', desc: 'Tieng Nhat thuong mai cho IT', color: 'bg-red-50 border-red-200', slug: 'business-jp' },
  ]

  const stats = [
    { label: 'Hoc vien', value: '500+' },
    { label: 'Bai hoc', value: '120+' },
    { label: 'Tu vung', value: '2,000+' },
    { label: 'De thi thu', value: '50+' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F1B35] via-[#1a2d4f] to-[#0F6E56] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-small font-medium mb-6">
            <span>🇻🇳</span>
            <span>Danh rieng cho nguoi Viet lam IT tai Nhat</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Hoc IT Passport, BrSE &
            <br />
            <span className="text-[#1D9E75]">SAP</span> bang tieng Viet
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nen tang hoc tap duoc thiet ke rieng cho IT engineer Viet Nam tai Nhat.
            Noi dung thuc te, tu du an thuc, phu hop moi truong lam viec Nhat Ban.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-primary text-white font-semibold text-body hover:opacity-90 transition-opacity"
            >
              Bat dau mien phi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-white/10 text-white font-semibold text-body hover:bg-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Xem khoa hoc
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface border-b border-[rgba(0,0,0,0.06)] py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-text-primary">{s.value}</div>
              <div className="text-small text-text-secondary mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tracks */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-text-primary text-center mb-2">
            4 chu de hoc tap
          </h2>
          <p className="text-body text-text-secondary text-center mb-10">
            Tu co ban den nang cao — hoc theo lo trinh phu hop muc tieu cua ban
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/courses?track=${track.slug}`}
                className={`p-5 rounded-lg border-2 ${track.color} hover:shadow-card transition-shadow`}
              >
                <div className="text-3xl mb-3">{track.icon}</div>
                <h3 className="font-semibold text-text-primary text-body">{track.title}</h3>
                <div className="text-caption text-text-secondary mb-2">{track.title_ja}</div>
                <p className="text-small text-text-secondary">{track.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-small font-medium text-primary">
                  Xem khoa hoc
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-text-primary text-center mb-10">
            Tai sao chon BrSE Bridge Academy?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: 'Hoi thoai thuc te',
                desc: 'Hoc tu tinh huong thuc trong du an Nhat — khong phai sach giao khoa',
              },
              {
                icon: <BookOpen className="w-6 h-6 text-primary" />,
                title: 'Tu dien IT Nhat-Viet',
                desc: 'Deck tu vung ca nhan + spaced repetition de nho lau',
              },
              {
                icon: <Trophy className="w-6 h-6 text-primary" />,
                title: 'Gamification',
                desc: 'XP, streak, level badge — hoc co dong luc moi ngay',
              },
            ].map((f, i) => (
              <div key={i} className="bg-surface rounded-lg p-5 shadow-card">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                <p className="text-small text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-h2 font-bold text-text-primary mb-3">
            Bat dau hoc ngay hom nay
          </h2>
          <p className="text-body text-text-secondary mb-6">
            Mien phi. Khong can the tin dung. 3 bai hoc dau moi khoa hoan toan mien phi.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-white font-semibold text-body hover:opacity-90 transition-opacity"
          >
            Dang ky mien phi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
