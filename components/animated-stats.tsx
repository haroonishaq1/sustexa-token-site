"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Leaf, Zap } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

const stats = [
  
  {
    icon: Leaf,
    value: 1000000,
    suffix: "",
    label: "Trees Planted",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    value: 2000000000,
    suffix: "",
    label: "Total Supply",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Zap,
    value: 99,
    suffix: "%",
    label: "Energy Efficient",
    gradient: "from-yellow-500 to-orange-600",
  },
]

export function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 transform hover:scale-105 transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`} />
            <div className="absolute inset-0 bg-black/10" />
            <CardContent className="relative z-10 p-6 text-center text-white">
              <Icon className="w-8 h-8 mx-auto mb-3 group-hover:animate-bounce" />
              <div className="text-2xl font-bold mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/80 text-sm font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
