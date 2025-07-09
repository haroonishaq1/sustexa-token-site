"use client"

import { useEffect, useState } from "react"
import { Leaf, Coins, Zap, Globe } from "lucide-react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const elements = [
    { Icon: Leaf, delay: 0, color: "text-green-400/30" },
    { Icon: Coins, delay: 1, color: "text-emerald-400/30" },
    { Icon: Zap, delay: 2, color: "text-green-300/30" },
    { Icon: Globe, delay: 3, color: "text-emerald-300/30" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map(({ Icon, delay, color }, index) => (
        <div
          key={index}
          className={`absolute animate-float ${color}`}
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + index * 15}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${4 + index}s`,
          }}
        >
          <Icon size={24 + index * 8} />
        </div>
      ))}
    </div>
  )
}
