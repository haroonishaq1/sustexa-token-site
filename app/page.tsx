import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Zap, Copy, ExternalLink, Shield, Globe, Coins, Sparkles, Users, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TokenomicsChart } from "@/components/tokenomics-chart"
import { VerticalRoadmap } from "@/components/vertical-roadmap"
import { VibrantEcosystem } from "@/components/vibrant-ecosystem"
import { AnimatedStats } from "@/components/animated-stats"
import { FloatingElements } from "@/components/floating-elements"
import { ForwardReverseVideo } from "@/components/forward-reverse-video"
import TickerBanner from "@/components/ticker-banner"
import PresaleCountdown from "@/components/presale-countdown"

export default function SustexaLanding() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black font-sans">
      {/* Background with gradient and trees */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #047857 100%)"
        }}
      />
      <div 
        className="fixed inset-0 z-[1] opacity-10"
        style={{
          backgroundImage: "url('/trees.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <FloatingElements />

      {/* Navigation - Updated for better contrast */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 backdrop-blur-sm bg-black/40 border-b border-white/20">
        <div className="flex items-center gap-2 animate-bounce-in">
          <img src="/logo.png" alt="Sustexa Logo" className="h-8 w-auto" />
          <span className="text-white font-bold text-xl drop-shadow-lg">Sustexa</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-white/90 font-medium">
          <a href="#about" className="hover:text-white transition-all duration-300 hover:scale-110 drop-shadow-lg">
            About
          </a>
          <a href="#ecosystem" className="hover:text-white transition-all duration-300 hover:scale-110 drop-shadow-lg">
            Use Cases
          </a>
          <a href="#tokenomics" className="hover:text-white transition-all duration-300 hover:scale-110 drop-shadow-lg">
            Tokenomics
          </a>
          <a href="#roadmap" className="hover:text-white transition-all duration-300 hover:scale-110 drop-shadow-lg">
            Roadmap
          </a>
          <a href="#community" className="hover:text-white transition-all duration-300 hover:scale-110 drop-shadow-lg">
            Community
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/presale">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 mr-2" />
              Buy $SUXA
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Enhanced text contrast */}
      <section className="relative z-10 pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="text-white drop-shadow-xl">WELCOME TO</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-black/80">SUSTEXA</span>
                </h1>
                <div className="w-20 h-1 bg-black rounded-full animate-pulse"></div>
                <p className="text-xl md:text-2xl text-black font-semibold leading-relaxed max-w-2xl drop-shadow-lg">
                  At Sustexa, we unite innovation and sustainability to create a better future. From a global
                  marketplace for eco-friendly products to an immersive Web3 PvP game that rewards
                  real-world green actions, our mission is to empower communities to live, shop, and play
                  sustainably
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/presale">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 text-lg px-8 py-4 font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Zap className="w-5 h-5 mr-2" />
                    Buy $SUXA Now
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white">2B</div>
                  <div className="text-white text-sm font-medium">Total Supply</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white">Solana</div>
                  <div className="text-white text-sm font-medium">Blockchain</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white">Live</div>
                  <div className="text-white text-sm font-medium">Ecosystem</div>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative animate-bounce-in" style={{ animationDelay: "0.3s" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <Image
                  src="/coin-wallet.png"
                  alt="Sustexa Coin and Wallet"
                  width={500}
                  height={500}
                  className="relative z-10 drop-shadow-2xl transform hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Banner */}
      <div className="relative z-10">
        <div className="overflow-hidden">
          <TickerBanner />
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center md:text-5xl font-bold text-white drop-shadow-xl mb-12">
            Join the Movement to Make Sustainability Playable and Profitable
          </h2>
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white mr-3" />
              <div className="w-16 h-1 bg-white rounded-full"></div>
            </div>
            <p className="text-xl md:text-2xl text-white text-center leading-relaxed mb-6 drop-shadow-lg">
              Join Sustexa and turn sustainability into action. Experience a groundbreaking platform
              where eco-friendly shopping meets thrilling gameplay—all powered by $SUXA. Earn
              rewards, make real impact, and profit while protecting the planet. Sustainability has never
              been this engaging or rewarding.
            </p>
            <p className="text-lg text-green-200 text-center leading-relaxed">
              Our mission is to empower individuals worldwide to make conscious choices
              effortlessly—whether shopping or gaming—by creating a seamless ecosystem that rewards positive environmental impact.
            </p>
          </div>
        </div>
      </section>

      {/* Vibrant Ecosystem Section */}
      <section id="ecosystem" className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl mb-4">
              Core Use Cases of $SUXA
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-black rounded-full"></div>
            </div>
          </div>
          <VibrantEcosystem />
        </div>
      </section>

      {/* Presale Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <PresaleCountdown />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text text-white">
              Why Choose Sustexa?
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-900 rounded-full"></div>
            </div>
          </div>

          {/* Container with split background */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Split background gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent"
              style={{ background: "linear-gradient(90deg, #000000 0%, #000000 50%, #000000 50.1%, #1a4d2e 100%)" }}
            ></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-12">
              {/* 3D Character on the left */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
                  <ForwardReverseVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20%28800%20x%20850%20px%29%20%281%29-eS8WwTRaGsNSUPP3GwpcymPKXtWeYg.mp4"
                    className="relative z-10 drop-shadow-2xl transform hover:scale-105 transition-all duration-500 rounded-2xl"
                  />
                </div>
              </div>

              {/* Features in 2x2 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-pink-500/60 via-pink-600 to-purple-600/60 backdrop-blur-sm border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 transform group">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-pink-400 mx-auto mb-4 group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold text-pink-300 mb-3">Real Utility</h3>
                    <p className="text-white/90">
                      $SUXA delivers tangible value—seamlessly integrating sustainable shopping and rewarding
                      eco-friendly gameplay, creating real-world impact beyond the blockchain.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-500/60 via-cyan-600 to-blue-600/60 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 transform group">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold text-cyan-300 mb-3">Solana Powered</h3>
                    <p className="text-white/90">
                      Built on Solana's lightning-fast, low-cost blockchain, $SUXA ensures smooth, scalable, and
                      secure transactions for gamers and shoppers worldwide.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600/60 backdrop-blur-sm border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105 transform group">
                  <CardContent className="p-6 text-center">
                    <Globe className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold text-green-300 mb-3">Global Impact</h3>
                    <p className="text-white/90">
                      Sustexa drives positive environmental change by empowering communities across the
                      globe to support sustainability through daily actions and innovative technology.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/60 via-yellow-600 to-orange-600/60 backdrop-blur-sm border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 transform group">
                  <CardContent className="p-6 text-center">
                    <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4 group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold text-yellow-300 mb-3">Multi-Platform</h3>
                    <p className="text-white/90">
                      $SUXA fuels a unified ecosystem—powering both a dynamic Web3 PvP game and a
                      cutting-edge sustainable marketplace, bridging gaming and commerce effortlessly.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Whitepaper Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-900/60 to-black/60 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-6">
                Whitepaper
              </h2>
              <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
                Download our comprehensive whitepaper to learn more about Sustexa's technology, tokenomics, and vision for a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/whitepaper.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Whitepaper
                </a>
                <a
                  href="/whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-800/40 hover:bg-green-800/60 text-green-300 border border-green-500/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  Preview Whitepaper
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-900/60 to-black/60 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-green-500/20">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4">
                HOW TO BUY
              </h2>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-800/80 to-black/80 rounded-2xl p-4 border border-green-500/30">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <span className="font-semibold text-sm md:text-base">Contract Address:</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
                  <code className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded text-xs sm:text-sm break-all w-full sm:w-auto text-center">
                    4n7QaoeSbNL5NFR5H7W2erEGAnTHsQwPrDL5q5FwwVFy
                  </code>
                  <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300 shrink-0">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                image: "/character-3d-wallet.png",
                title: "Get a Solana Wallet",
                description: "Download Phantom, Solflare, or any Solana-compatible wallet",
                gradient: "from-pink-500 to-purple-600",
                borderColor: "border-pink-500/30 hover:border-pink-400/60",
              },
              {
                image: "/character-3d-coin.png",
                title: "Buy SOL",
                description: "Purchase SOL from any major exchange and transfer to your wallet",
                gradient: "from-cyan-500 to-blue-600",
                borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
              },
              {
                image: "/character-3d-thumbs.png",
                title: "Swap for $SUXA",
                description: "Use Jupiter or Raydium to swap your SOL for $SUXA tokens",
                gradient: "from-green-500 to-emerald-600",
                borderColor: "border-green-500/30 hover:border-green-400/60",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br from-green-800/80 to-black/80 backdrop-blur-sm border ${step.borderColor} transition-all duration-300 hover:scale-105 transform group`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={`Step ${index + 1} Character`}
                      width={120}
                      height={120}
                      className="drop-shadow-lg group-hover:animate-subtle-bounce"
                    />
                  </div>
                  <div
                    className={`bg-gradient-to-r ${step.gradient} rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-300 mb-3">{step.title}</h3>
                  <p className="text-green-200">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text text-white mb-4">
              Roadmap
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-900 rounded-full"></div>
            </div>
            <p className="text-green-200 text-lg">
              Our strategic plan to build and expand the Sustexa ecosystem globally
            </p>
          </div>

          <VerticalRoadmap />
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-green-900/60 to-black/60 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-8 h-8 text-green-400" />
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  Tokenomics
                </h2>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-800/80 to-black/80 rounded-2xl p-6 border border-green-500/30 text-center transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-green-300 mb-2">Total Supply</h3>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    2,000,000,000
                  </p>
                  <p className="text-green-200 text-lg">$SUXA</p>
                </div>

                <div className="space-y-3">
                <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Community & Rewards</span>
                    <span className="font-bold text-green-200 text-lg">35%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Development</span>
                    <span className="font-bold text-green-200 text-lg">20%</span>
                  </div>
                  
                  
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Marketing</span>
                    <span className="font-bold text-green-200 text-lg">15%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Token Sale</span>
                    <span className="font-bold text-green-200 text-lg">10%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Liquidity & Exchange Pool</span>
                    <span className="font-bold text-green-200 text-lg">10%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-800/60 to-black/60 rounded-lg p-4 border border-green-500/20 transform hover:scale-105 transition-all duration-300">
                    <span className="font-semibold text-green-300">Staking</span>
                    <span className="font-bold text-green-200 text-lg">10%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full h-[400px] max-w-[500px]">
                  <TokenomicsChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - Updated with Contact Links */}
      <section id="community" className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text text-white mb-4">
              Join Our Community
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-900 rounded-full"></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Community content */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-green-900/60 to-black/60 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-8 h-8 text-green-400" />
                  <h3 className="text-2xl font-bold text-green-300">Contact & Socials</h3>
                </div>
                <div className="space-y-4 mb-8">
                  
                  <a href="https://twitter.com/sustexa" 
                     className="flex items-center gap-3 text-lg text-green-200 hover:text-green-400 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter: @sustexa
                  </a>
                  <a href="https://t.me/sustexa" 
                     className="flex items-center gap-3 text-lg text-green-200 hover:text-green-400 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.07-.74 4.2-1.82 7-3.03 8.4-3.62 4-.17 4.83 1.22 4.73 2.12z" />
                    </svg>
                    Telegram: t.me/sustexa
                  </a>
                  <a href="https://instagram.com/sustexatoken" 
                     className="flex items-center gap-3 text-lg text-green-200 hover:text-green-400 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                    Instagram: @sustexatoken
                  </a>
                  <a href="mailto:hello@sustexa.com" 
                     className="flex items-center gap-3 text-lg text-green-200 hover:text-green-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email: hello@sustexa.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - 3D Character */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
                <Image
                  src="/character-thumbs-up.gif"
                  alt="Sustexa Community Character - Thumbs Up"
                  width={500}
                  height={500}
                  className="relative z-10 drop-shadow-2xl transform hover:scale-105 transition-all duration-500"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center border-t border-green-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Sustexa Logo" className="h-8 w-auto" />
            <span className="text-white font-bold text-xl">Sustexa</span>
          </div>
          <p className="text-white">© 2025 Sustexa. Building a sustainable future, one token at a time.</p>
        </div>
      </footer>
    </div>
  )
}
