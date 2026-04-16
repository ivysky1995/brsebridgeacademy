// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BrSE Bridge Academy',
    template: '%s | BrSE Bridge Academy',
  },
  description: 'Nền tảng học IT Passport, BrSE Skills & SAP cho người Việt tại Nhật',
  keywords: ['BrSE', 'IT Passport', 'SAP', 'Japanese', 'Vietnam', 'Learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}

