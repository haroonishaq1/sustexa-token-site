"use client"

import { useState } from "react"
import { Copy, ExternalLink, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSolanaPrice } from "@/hooks/use-solana-price"
import { usePresaleCountdown } from "@/hooks/use-presale-countdown"

export default function PresaleCountdown() {
  const { price: solPriceUSD } = useSolanaPrice();
  const contractAddress = "4n7QaoeSbNL5NFR5H7W2erEGAnTHsQwPrDL5q5FwwVFy";
  const { timeLeft, title, phase, isMounted, isPresaleActive } = usePresaleCountdown();
  const [copied, setCopied] = useState<string | null>(null)
  
  // Debug logging
  console.log('🐞 Countdown Debug:', { phase, isPresaleActive, timeLeft });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const presaleTokens = "15,000,000 $SUS"
  
  // Dynamic rates based on live SOL price
  const presale1Rate = solPriceUSD > 0 ? (solPriceUSD / 0.002).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '75,725'
  const presale2Rate = solPriceUSD > 0 ? (solPriceUSD / 0.005).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '30,290'

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-green-600 via-emerald-700 to-black rounded-2xl border border-green-500/30 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-green-300 mb-8 tracking-wider uppercase">
          {isMounted ? title : 'Presale 1 is live in'}
        </h1>

        {/* Countdown with Leaf Images */}
        <div className="flex justify-center items-center gap-1 md:gap-8 mb-12 flex-wrap">
          {isMounted ? [
            { value: timeLeft.days, label: "DAYS" },
            { value: timeLeft.hours, label: "HOURS" },
            { value: timeLeft.minutes, label: "MINUTES" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-[100px] h-[100px] md:w-[200px] md:h-[200px]">
                <Image 
                  src="/leaf.png" 
                  alt="Leaf" 
                  fill
                  className="object-contain transform hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center -translate-y-2 md:-translate-y-6">
                  <span className="text-2xl md:text-6xl lg:text-7xl font-bold text-green-200 drop-shadow-lg">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <span className="text-green-300 font-semibold text-xs md:text-lg mt-2 md:mt-3">{item.label}</span>
            </div>
          )) : [
            { value: 1, label: "DAYS" },
            { value: 8, label: "HOURS" },
            { value: 25, label: "MINUTES" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-[100px] h-[100px] md:w-[200px] md:h-[200px]">
                <Image 
                  src="/leaf.png" 
                  alt="Leaf" 
                  fill
                  className="object-contain transform hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center -translate-y-2 md:-translate-y-6">
                  <span className="text-2xl md:text-6xl lg:text-7xl font-bold text-green-200 drop-shadow-lg">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <span className="text-green-300 font-semibold text-xs md:text-lg mt-2 md:mt-3">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Address Box - Larger */}
        <div className="md:col-span-2 bg-green-900/20 border border-green-500/40 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-green-300 font-bold text-xl mb-6 text-center">CONTRACT ADDRESS</h3>
          <div
            className="bg-black/40 border border-green-500/30 rounded-lg p-4 mb-6 cursor-pointer hover:bg-black/60 transition-colors group"
            onClick={() => copyToClipboard(contractAddress, "address")}
          >
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-base font-mono break-all pr-4">{contractAddress}</span>
              {copied === "address" ? (
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <Copy className="w-5 h-5 text-green-300 flex-shrink-0 group-hover:text-green-200" />
              )}
            </div>
          </div>

          <h4 className="text-green-300 font-semibold text-center mb-4 text-lg">TOKENS FOR PRESALE</h4>
          <div className="text-center rounded-lg p-4 transition-colors border border-green-500/20">
            <span className="text-green-100 text-2xl font-bold">{presaleTokens}</span>
          </div>
        </div>

        {/* Rates Box */}
        <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-green-300 font-bold text-lg mb-6 text-center">RATES</h3>

          <div className="mb-6">
            <h4 className="text-green-300 font-semibold text-center mb-3">PRESALE 1</h4>
            <div className="text-center rounded-lg p-3 transition-colors border border-green-500/20">
              <span className="text-green-100 text-lg font-bold">1 SOL = {presale1Rate} $SUS</span>
              <p className="text-green-400/60 text-xs mt-1">$0.002 per token</p>
            </div>
          </div>

          <div>
            <h4 className="text-green-300 font-semibold text-center mb-3">PRESALE 2</h4>
            <div className="text-center rounded-lg p-3 transition-colors border border-green-500/20">
              <span className="text-green-100 text-lg font-bold">1 SOL = {presale2Rate} $SUS</span>
              <p className="text-green-400/60 text-xs mt-1">$0.005 per token</p>
            </div>
          </div>
        </div>
      </div>

      {/* Presale Button */}
      <div className="text-center">
        {isPresaleActive ? (
          <Link
            href="/presale"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-green-900 font-bold text-xl px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            JOIN PRESALE
            <ExternalLink className="w-6 h-6" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-3 bg-gray-600 text-gray-400 font-bold text-xl px-12 py-4 rounded-xl cursor-not-allowed opacity-60">
            PRESALE COMING SOON
            <ExternalLink className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Copy Feedback */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-black px-6 py-3 rounded-lg shadow-lg border border-green-400">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}
