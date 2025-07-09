"use client"

import { useEffect, useRef } from "react"

interface ForwardReverseVideoProps {
  src: string
  width?: number
  height?: number
  className?: string
}

/**
 * Plays a video forward, then “rewinds” it in small time-steps,
 * looping infinitely for a seamless forward–reverse effect.
 */
export function ForwardReverseVideo({ src, width = 550, height = 550, className = "" }: ForwardReverseVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let reverseInterval: ReturnType<typeof setInterval> | null = null
    const step = 0.033 // ≈ 30 fps (seconds)

    const playForward = () => {
      if (reverseInterval) {
        clearInterval(reverseInterval)
        reverseInterval = null
      }
      video.play().catch(() => {
        /* ignore autoplay errors */
      })
    }

    const playBackward = () => {
      if (reverseInterval) return
      reverseInterval = setInterval(() => {
        if (video.currentTime <= step) {
          // reached the start – go forward again
          clearInterval(reverseInterval!)
          reverseInterval = null
          video.currentTime = 0
          playForward()
        } else {
          video.currentTime = Math.max(0, video.currentTime - step)
        }
      }, step * 1000)
    }

    video.addEventListener("ended", playBackward)
    // start initial forward play
    playForward()

    return () => {
      video.removeEventListener("ended", playBackward)
      if (reverseInterval) clearInterval(reverseInterval)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      width={width}
      height={height}
      muted
      playsInline
      className={className}
      // we control play via JS, so no autoPlay attribute
    />
  )
}
