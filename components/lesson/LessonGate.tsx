// @ts-nocheck
import Link from 'next/link'
import { Lock, CheckCircle, ArrowRight } from 'lucide-react'

interface Props {
  completedTopics: string[]
  unlockTopics: string[]
  loginRedirectUrl: string
}

export default function LessonGate({ completedTopics, unlockTopics, loginRedirectUrl }: Props) {
  return (
    <div className="relative">
      {/* Blurred preview */}
      <div
        className="h-48 rounded-lg overflow-hidden"
        style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}
        aria-hidden
      >
        <div className="p-6 bg-surface border border-[rgba(0,0,0,0.08)] h-full">
          <div className="h-4 bg-secondary rounded w-3/4 mb-3" />
          <div className="h-4 bg-secondary rounded w-1/2 mb-3" />
          <div className="h-4 bg-secondary rounded w-5/6" />
        </div>
      </div>

      {/* Gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-surface rounded-xl shadow-modal border border-[rgba(0,0,0,0.1)] p-6 w-full max-w-md mx-4">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-h3 font-semibold text-text-primary">
              Bài học tiếp theo cần đăng nhập
            </h3>
          </div>

          {/* What they learned */}
          {completedTopics.length > 0 && (
            <div className="mb-4">
              <div className="text-small font-semibold text-text-secondary mb-2">
                Bạn đã học được:
              </div>
              <div className="space-y-1.5">
                {completedTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-small text-text-primary">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What they'll unlock */}
          {unlockTopics.length > 0 && (
            <div className="mb-5">
              <div className="text-small font-semibold text-text-secondary mb-2">
                Tiếp tục đềEhọc:
              </div>
              <div className="space-y-1.5">
                {unlockTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-small text-text-primary">
                    <ArrowRight className="w-4 h-4 text-accent shrink-0" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-3">
            <Link
              href={`/register?redirectTo=${encodeURIComponent(loginRedirectUrl)}`}
              className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-white font-semibold text-small hover:opacity-90 transition-opacity"
            >
              Đăng ký miềE phí
            </Link>
            <Link
              href={`/login?redirectTo=${encodeURIComponent(loginRedirectUrl)}`}
              className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-md border border-[rgba(0,0,0,0.15)] text-text-primary font-semibold text-small hover:bg-secondary transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

