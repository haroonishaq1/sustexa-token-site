import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Sustexa Token',
  description: 'Sustexa Token - The future of sustainable tokenomics',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
     
        <main className="min-h-screen">{children}</main>
        
        
      </body>
    </html>
  )
}
