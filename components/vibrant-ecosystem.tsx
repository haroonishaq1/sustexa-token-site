"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Building2, ShoppingCart, Users } from "lucide-react"
import { useState } from "react"

const ecosystemData = [
  {
    title: "Shopping",
    subtitle: "Global E-Commerce Marketplace",
    description:
      "Discover Sustexa, the world's premier marketplace for sustainable products and services. Powered by the Sustainable ID (SID), buyers transparently track eco-KPIs to make truly green choices. Seamless payments with $SUXA enable fast, secure transactions. Boost your brand with targeted $SUXA-powered advertising. Shop smarter, support sustainability, and join the eco-revolution with $SUXA.",
    gradient: "from-green-400 via-lime-500 to-green-600",
    icon: ShoppingCart,
    hoverGradient: "from-green-300 via-lime-400 to-green-500",
  },
  {
    title: "Gaming",
    subtitle: "The Web3 PvP Game with Green Impact",
    description:
      "Enter SustainHeroes, the revolutionary PvP arena where players battle using sustainable attacks powered by $SUXA. Level up by completing real-world eco quests or staking $SUXA tokens. Earn rewards, compete globally, and fuel a greener future—all while playing. Experience gaming that empowers sustainability.",
    gradient: "from-pink-500 via-purple-500 to-pink-600",
    icon: Gamepad2,
    hoverGradient: "from-pink-400 via-purple-400 to-pink-500",
  },
]

export function VibrantEcosystem() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {ecosystemData.map((item, index) => {
        const Icon = item.icon
        return (
          <Card
            key={index}
            className={`relative overflow-hidden border-0 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                hoveredIndex === index ? item.hoverGradient : item.gradient
              } transition-all duration-500`}
            />
            <div className="absolute inset-0 bg-black/20" />
            <CardContent className="relative z-10 p-6 h-full flex flex-col">
              <div className="mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block mb-3">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-8 h-8 text-white/90" />
                  <span className="text-white/80 font-medium">{item.subtitle}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed flex-grow">{item.description}</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-pulse" style={{ width: "70%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
