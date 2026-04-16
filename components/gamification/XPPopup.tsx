// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

interface Props {
  xp: number
  onDone: () => void
}

export default function XPPopup({ xp, onDone }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="fixed top-20 right-6 z-50 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.95)',
      }}
    >
      <div className="xp-pop flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-primary shadow-modal text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-caption text-white/70 font-medium">Kiếm được XP!</div>
          <div className="text-h3 font-bold">+{xp} XP</div>
        </div>
      </div>
    </div>
  )
}

