"use client"

import * as React from "react"
import Link from "next/link"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { usePresaleCountdown } from "@/hooks/use-presale-countdown"

export function Navbar() {
  const { phase } = usePresaleCountdown()
  
  // Presale is accessible only when in presale-ending phase (after July 10)
  const isPresaleAccessible = phase === 'presale-ending' || phase === 'ended'
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-full max-w-[1400px] items-center justify-between px-4 md:px-8">
        <div className="flex gap-2">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="hidden text-lg font-semibold text-primary md:block">
              Sustexa
            </span>
          </Link>
          <a
            href="/whitepaper.pdf"
            download
            className="ml-4 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105"
          >
            📄 Download Whitepaper
          </a>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4 md:gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#ecosystem">Use Cases</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#tokenomics">Tokenomics</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#roadmap">Roadmap</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/#community">Community</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden md:flex">
          {isPresaleAccessible ? (
            <Button 
              asChild
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105"
            >
              <Link href="/presale">
                <Sparkles className="h-5 w-5" />
                Buy $SUXA
              </Link>
            </Button>
          ) : (
            <Button 
              disabled
              className="flex items-center gap-2 rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-gray-300 shadow-md cursor-not-allowed opacity-60"
            >
              <Sparkles className="h-5 w-5" />
              Coming Soon
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}