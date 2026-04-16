// @ts-nocheck
import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Trophy, Users } from 'lucide-react'

export default function LandingPage() {
  const tracks = [
    { icon: '📋', title: 'IT Passport', title_ja: 'ITパスポ�EチE, desc: 'Luyện thi chứng chềEIT Nhật Bản', color: 'bg-blue-50 border-blue-200', slug: 'it-passport' },
    { icon: '🌉', title: 'BrSE Skills', title_ja: 'ブリチE��SEスキル', desc: 'Kỹ năng Bridge SE thực chiến', color: 'bg-green-50 border-green-200', slug: 'brse-skills' },
    { icon: '🔷', title: 'SAP Japan', title_ja: 'SAP日本誁E, desc: 'SAP consultant tại thềEtrường Nhật', color: 'bg-purple-50 border-purple-200', slug: 'sap-japan' },
    { icon: '🎌', title: 'Business Japanese IT', title_ja: 'ビジネス日本誁E, desc: 'Tiếng Nhật thương mại cho IT', color: 'bg-red-50 border-red-200', slug: 'business-jp' },
  ]

  const stats = [
    { label: 'Học viên', value: '500+' },
    { label: 'Bài học', value: '120+' },
    { label: 'Từ vựng', value: '2,000+' },
    { label: 'ĐềEthi thử', value: '50+' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F1B35] via-[#1a2d4f] to-[#0F6E56] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-small font-medium mb-6">
            <span>�E�E</span>
            <span>Dành riêng cho người Việt làm IT tại Nhật</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Học IT Passport, BrSE &
            <br />
            <span className="text-[#1D9E75]">SAP</span> bằng tiếng Việt
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nền tảng học tập được thiết kế riêng cho IT engineer Việt Nam tại Nhật. Nội dung thực tế,
            từ dự án thực, phù hợp môi trường làm việc Nhật Bản.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-primary text-white font-semibold text-body hover:opacity-90 transition-opacity"
            >
              Bắt đầu miềE phí
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-white/10 text-white font-semibold text-body hover:bg-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Xem khóa học
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
            4 chủ đềEhọc tập
          </h2>
          <p className="text-body text-text-secondary text-center mb-10">
            Từ cơ bản đến nâng cao  Ehọc theo lềEtrình phù hợp mục tiêu của bạn
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/courses?track=${track.slug}`}
                className={`fade-in-up p-5 rounded-lg border-2 ${track.color} hover:shadow-card transition-shadow`}
              >
                <div className="text-3xl mb-3">{track.icon}</div>
                <h3 className="font-semibold text-text-primary text-body">{track.title}</h3>
                <div className="text-caption text-text-secondary mb-2">{track.title_ja}</div>
                <p className="text-small text-text-secondary">{track.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-small font-medium text-primary">
                  Xem khóa học
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
            Tại sao chọn BrSE Bridge Academy?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: 'Hội thoại thực tế',
                desc: 'Học từ tình huống thực trong dự án Nhật  Ekhông phải sách giáo khoa',
              },
              {
                icon: <BookOpen className="w-6 h-6 text-primary" />,
                title: 'Từ điển IT Nhật-Việt',
                desc: 'Deck từ vựng cá nhân + spaced repetition đềEnhềElâu',
              },
              {
                icon: <Trophy className="w-6 h-6 text-primary" />,
                title: 'Gamification',
                desc: 'XP, streak, level badge  Ehọc có động lực mỗi ngày',
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
            Bắt đầu học ngay hôm nay
          </h2>
          <p className="text-body text-text-secondary mb-6">
            MiềE phí. Không cần thẻ tín dụng. 3 bài học đầu mỗi khóa hoàn toàn miềE phí.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-white font-semibold text-body hover:opacity-90 transition-opacity"
          >
            Đăng ký miềE phí
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

