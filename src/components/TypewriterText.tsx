import { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
}

// Reveals `text` character-by-character, restarting whenever the text changes.
// Gives AI replies and agent insights a live "streaming" feel.
export default function TypewriterText({ text, speed = 18, className }: TypewriterTextProps) {
  const [shown, setShown] = useState('')
  const iRef = useRef(0)

  useEffect(() => {
    iRef.current = 0
    setShown('')
    const id = setInterval(() => {
      iRef.current += 1
      setShown(text.slice(0, iRef.current))
      if (iRef.current >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return <span className={className}>{shown}</span>
}
