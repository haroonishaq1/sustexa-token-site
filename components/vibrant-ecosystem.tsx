"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Building2, ShoppingCart, Users } from "lucide-react"
import { useState } from "react"

const ecosystemData = [
  {
    title: "Eco Quests",
    subtitle: "GameFi Adventures",
    description:
      "Complete tasks like recycling, tree-planting, or awareness campaigns and earn $SUXA. These verified activities help create measurable positive environmental outcomes while rewarding your commitment.",
    gradient: "from-pink-500 via-purple-500 to-pink-600",
    icon: Gamepad2,
    hoverGradient: "from-pink-400 via-purple-400 to-pink-500",
  },
  {
    title: "Community",
    subtitle: "Global Network",
    description:
      "Invite friends, grow the network, and earn rewards through referral bonuses and tiered incentives. By building a global community, Sustexa amplifies the impact of collective climate action.",
    gradient: "from-cyan-400 via-blue-500 to-cyan-600",
    icon: Users,
    hoverGradient: "from-cyan-300 via-blue-400 to-cyan-500",
  },
  {
    title: "Shopping",
    subtitle: "Green Marketplace",
    description:
      "Use $SUXA to pay for green products, services, and donations in our upcoming marketplace. This creates a seamless way to support eco-friendly businesses and integrate sustainability into everyday life.",
    gradient: "from-green-400 via-lime-500 to-green-600",
    icon: ShoppingCart,
    hoverGradient: "from-green-300 via-lime-400 to-green-500",
  },
  {
    title: "Investments",
    subtitle: "Climate Finance",
    description:
      "Sustexa will integrate a powerful feature enabling users to connect directly with sustainable projects, startups, and verified green companies worldwide. This platform empowers users to back high-impact initiatives.",
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    icon: Building2,
    hoverGradient: "from-blue-400 via-indigo-400 to-purple-500",
  },
]

export function VibrantEcosystem() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
