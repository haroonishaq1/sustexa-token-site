"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, Rocket } from "lucide-react"

const roadmapData = [
  {
    quarter: "Q2 2025",
    title: "Foundation Phase",
    items: ["Pre-Sale 1 Launch", "Release of Sustexa Quest Platform"],
    status: "upcoming",
    color: "from-green-500 to-emerald-600",
  },
  {
    quarter: "Q3 2025",
    title: "Launch Phase",
    items: ["Private Sale 2", "Public Sale + DEX Listing", "Launch on Solanium"],
    status: "upcoming",
    color: "from-emerald-500 to-green-600",
  },
  {
    quarter: "Q1 2026",
    title: "Growth Phase",
    items: ["Sustexa App Launch", "Integration with Eco Partners", "Green Ambassador Program"],
    status: "upcoming",
    color: "from-green-600 to-emerald-700",
  },
  {
    quarter: "Q2 2026",
    title: "Expansion Phase",
    items: ["Full Launch of Greenverse", "Quests + Arena Mode"],
    status: "upcoming",
    color: "from-emerald-600 to-green-700",
  },
]

export function AnimatedRoadmap() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => {
        if (prev.length < roadmapData.length) {
          return [...prev, prev.length]
        }
        return prev
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {roadmapData.map((phase, index) => (
        <div
          key={index}
          className={`transform transition-all duration-700 ${
            visibleItems.includes(index)
              ? "translate-x-0 opacity-100"
              : index % 2 === 0
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
          }`}
        >
          <Card
            className={`bg-gradient-to-br ${phase.color}/20 to-black/60 backdrop-blur-sm border-green-500/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer group`}
            onClick={() => setActivePhase(activePhase === index ? -1 : index)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {phase.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : phase.status === "current" ? (
                    <Rocket className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <Clock className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-semibold">{phase.quarter}</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-200">{phase.title}</h3>
                </div>
                <div
                  className={`transform transition-transform duration-300 ${activePhase === index ? "rotate-180" : ""}`}
                >
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  activePhase === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-3 pt-4 border-t border-green-500/20">
                  {phase.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`flex items-start gap-3 transform transition-all duration-300 delay-${itemIndex * 100} ${
                        activePhase === index ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                      <span className="text-green-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
