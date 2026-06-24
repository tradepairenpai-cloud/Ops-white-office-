import { Wifi, Battery, Signal } from 'lucide-react'

interface StatusBarProps {
  timeString: string
}

export default function StatusBar({ timeString }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1">
      <span className="text-sm font-bold text-text-main tracking-wide">{timeString}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} className="text-text-main" />
        <Wifi size={14} className="text-text-main" />
        <Battery size={16} className="text-text-main" />
      </div>
    </div>
  )
}
