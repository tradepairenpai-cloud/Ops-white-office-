import type { ReactNode } from 'react'

interface ProgressRingProps {
  value: number
  max: number
  color: string
  size?: number
  stroke?: number
  track?: string
  children?: ReactNode
}

// Animated SVG circular progress ring. Center content via `children`.
export default function ProgressRing({
  value, max, color, size = 88, stroke = 8, track = '#F3F4F6', children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(value / max, 1))
  const offset = circ * (1 - pct)

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={track} strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
