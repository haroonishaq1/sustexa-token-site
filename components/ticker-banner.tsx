"use client"

import { Rocket } from "lucide-react"

export default function TickerBanner() {
  return (
    <div className="relative mx-[calc(-50vw+50%)] w-screen h-32 overflow-hidden">
      <div className="absolute inset-0">
        {/* Top banner */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-green-500 to-green-300 shadow-lg">
          <div className="flex items-center h-full whitespace-nowrap animate-scroll">
            <div className="flex items-center text-white font-black text-2xl md:text-4xl lg:text-5xl px-4">
              <span className="flex items-center gap-6">
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE SUSTEXA REVOLUTION</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE SUSTEXA REVOLUTION</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE SUSTEXA REVOLUTION</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE SUSTEXA REVOLUTION</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE SUSTEXA REVOLUTION</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-r from-green-600 to-green-400 shadow-lg">
          <div className="flex items-center h-full whitespace-nowrap animate-scroll-reverse">
            <div className="flex items-center text-yellow-300 font-black text-2xl md:text-4xl lg:text-5xl px-4">
              <span className="flex items-center gap-6">
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE FUTURE NOW</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE FUTURE NOW</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE FUTURE NOW</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE FUTURE NOW</span>
                <Rocket className="w-6 h-6 md:w-8 md:h-8" />
                <span>JOIN THE FUTURE NOW</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
