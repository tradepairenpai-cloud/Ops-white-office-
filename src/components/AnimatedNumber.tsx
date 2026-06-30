import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
}

// Smoothly counts from the previously displayed value toward `value` whenever
// it changes — used for the live, ticking dashboard numbers.
export default function AnimatedNumber({ value, duration = 700, format }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const from = displayRef.current
    const to = value
    if (from === to) return
    const start = performance.now()

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (to - from) * eased
      displayRef.current = current
      setDisplay(current)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  const rounded = Math.round(display)
  return <>{format ? format(rounded) : rounded.toLocaleString()}</>
}
