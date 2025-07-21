"use client"

import { useState, useEffect } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownState {
  timeLeft: CountdownTime
  phase: 'presale-live' | 'presale-ending' | 'ended'
  title: string
}

// Get or set Phase 1 end time in localStorage (once set, it won't change on refresh)
// To reset timer: run localStorage.removeItem('phase1EndTime') in browser console and refresh
const getPhase1EndTime = () => {
  if (typeof window === 'undefined') {
    // July 10, 2025, 8:00 PM German time (CEST = UTC+2)
    return new Date('2025-07-10T20:00:00+02:00').getTime();
  }
  
  const savedTime = localStorage.getItem('phase1EndTime');
  if (savedTime) {
    return parseInt(savedTime, 10);
  }
  
  // If no saved time, set it to July 10, 2025, 8:00 PM German time (CEST = UTC+2)
  const newEndTime = new Date('2025-07-10T20:00:00+02:00').getTime();
  localStorage.setItem('phase1EndTime', newEndTime.toString());
  return newEndTime;
}

// Phase 1: Dynamic end time that persists across refreshes
const PHASE_1_END_TIME = getPhase1EndTime()

// Phase 2: August 15, 2025 at 8:00 PM German time (CEST) - Presale 1 ends
const PHASE_2_END_TIME = new Date('2025-08-15T20:00:00+02:00').getTime()

// Helper function to determine current phase and target time
const getCurrentPhaseInfo = () => {
  const now = Date.now()
  
  if (now < PHASE_1_END_TIME) {
    return {
      phase: 'presale-live' as const,
      title: 'Presale 1 is live in',
      targetTime: PHASE_1_END_TIME,
      isActive: false // Presale not active during countdown to go live
    }
  } else if (now < PHASE_2_END_TIME) {
    return {
      phase: 'presale-ending' as const,
      title: 'Presale 1 ends in',
      targetTime: PHASE_2_END_TIME,
      isActive: true // Presale is active during this phase
    }
  } else {
    return {
      phase: 'ended' as const,
      title: 'Presale 1 has ended',
      targetTime: 0,
      isActive: true // Keep access after presale ends
    }
  }
}

// Helper function to calculate time remaining
const calculateTimeRemaining = (targetTime: number) => {
  const now = Date.now()
  const remainingMs = Math.max(0, targetTime - now)
  
  // Use Math.ceil for minutes so that 1:59 shows as 2 minutes in the UI
  const totalMinutes = Math.ceil(remainingMs / (60 * 1000))
  
  // Use Math.floor for seconds for accurate counting
  const totalSeconds = Math.floor(remainingMs / 1000)
  
  return {
    days: Math.floor(totalMinutes / (24 * 60)),
    hours: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60
  }
}

export function usePresaleCountdown() {
  // Initialize with current phase info
  const initialPhaseInfo = getCurrentPhaseInfo()
  const initialTimeLeft = initialPhaseInfo.targetTime > 0 
    ? calculateTimeRemaining(initialPhaseInfo.targetTime)
    : { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(initialTimeLeft)
  const [phase, setPhase] = useState<'presale-live' | 'presale-ending' | 'ended'>(initialPhaseInfo.phase)
  const [title, setTitle] = useState(initialPhaseInfo.title)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setIsMounted(true)

    console.log('🚀 Initializing countdown at:', new Date().toISOString())
    console.log('🚀 PHASE_1_END_TIME:', new Date(PHASE_1_END_TIME).toISOString())
    console.log('🚀 PHASE_2_END_TIME:', new Date(PHASE_2_END_TIME).toISOString())

    // Set up interval to update countdown every second
    const timer = setInterval(() => {
      const phaseInfo = getCurrentPhaseInfo()
      
      console.log('⏰ Timer tick - Phase:', phaseInfo.phase, 'Title:', phaseInfo.title)
      
      if (phaseInfo.phase === 'ended') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setPhase('ended')
        setTitle('Presale 1 has ended')
        console.log('⏰ Presale has ended')
      } else {
        const newTimeLeft = calculateTimeRemaining(phaseInfo.targetTime)
        
        setTimeLeft(newTimeLeft)
        setPhase(phaseInfo.phase)
        setTitle(phaseInfo.title)
        
        console.log('⏰ Updated countdown:', {
          phase: phaseInfo.phase,
          timeLeft: newTimeLeft,
          title: phaseInfo.title
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Function to reset countdown (for testing purposes)
  const resetCountdown = () => {
    // For testing, reset to Phase 1
    const newPhaseInfo = {
      phase: 'presale-live' as const,
      title: 'Presale 1 is live in',
      targetTime: Date.now() + (30 * 1000) // 30 seconds from now
    }
    
    const newTimeLeft = calculateTimeRemaining(newPhaseInfo.targetTime)
    
    setTimeLeft(newTimeLeft)
    setPhase(newPhaseInfo.phase)
    setTitle(newPhaseInfo.title)
    
    console.log('🔄 Reset countdown for testing')
  }

  return {
    timeLeft,
    phase,
    title,
    resetCountdown,
    isMounted,
    isPresaleActive: phase === 'presale-ending' || phase === 'ended', // Active during phase 2 and after
  }
}
